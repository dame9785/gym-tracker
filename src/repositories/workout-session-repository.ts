import { Prisma, type WorkoutSession, type WorkoutSessionSet } from '@prisma/client';

import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// Prisma includes
// --------------------------------------------------

const sessionDetailsInclude = {
  exercises: {
    orderBy: {
      order: 'asc',
    },
    include: {
      workoutExercise: {
        include: {
          exercise: {
            include: {
              muscles: {
                include: {
                  muscleGroup: true,
                },
              },
            },
          },
        },
      },
      sets: {
        orderBy: {
          setNumber: 'asc',
        },
      },
    },
  },
} satisfies Prisma.WorkoutSessionInclude;

const sessionWithSetsInclude = {
  exercises: {
    orderBy: {
      order: 'asc',
    },
    include: {
      sets: {
        orderBy: {
          setNumber: 'asc',
        },
      },
    },
  },
} satisfies Prisma.WorkoutSessionInclude;

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type SessionWithDetails = Prisma.WorkoutSessionGetPayload<{
  include: typeof sessionDetailsInclude;
}>;

type SessionWithSets = Prisma.WorkoutSessionGetPayload<{
  include: typeof sessionWithSetsInclude;
}>;

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class WorkoutSessionRepository {
  async create(workoutId: number, userId: number, workoutScheduleId?: number): Promise<WorkoutSession> {
    const workoutExists = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!workoutExists) {
      throw new Error('Workout hittades inte.');
    }

    if (workoutScheduleId !== undefined) {
      const scheduleExists = await prisma.workoutSchedule.findFirst({
        where: {
          id: workoutScheduleId,
          userId,
          workoutId,
        },
        select: {
          id: true,
        },
      });

      if (!scheduleExists) {
        throw new Error('Schemaläggningen hittades inte.');
      }
    }

    const activeKey = workoutScheduleId !== undefined ? `${userId}:schedule:${workoutScheduleId}` : `${userId}:workout:${workoutId}`;

    // Reuse an existing active workout session.
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        userId,
        activeKey,
        status: 'ACTIVE',
      },
    });

    if (existingSession) {
      if (existingSession.activeKey === null) {
        await prisma.workoutSession.updateMany({
          where: {
            id: existingSession.id,
            status: 'ACTIVE',
            activeKey: null,
          },
          data: {
            activeKey,
          },
        });

        const updatedSession = await prisma.workoutSession.findUnique({
          where: {
            id: existingSession.id,
          },
        });

        if (updatedSession) {
          return updatedSession;
        }
      }

      return existingSession;
    }

    try {
      return await prisma.$transaction(
        async (tx): Promise<WorkoutSession> => {
          // Fetch and validate workout inside transaction.
          const workout = await tx.workout.findFirst({
            where: {
              id: workoutId,
              userId,
              archivedAt: null,
            },
            include: {
              exercises: {
                where: {
                  archivedAt: null,
                  exercise: {
                    is: {
                      archivedAt: null,
                    },
                  },
                },
                include: {
                  exercise: {
                    include: {
                      muscles: {
                        include: {
                          muscleGroup: true,
                        },
                      },
                    },
                  },
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
          });

          if (!workout) {
            throw new Error('Workout hittades inte.');
          }

          if (workout.exercises.length === 0) {
            throw new Error('Workout innehåller inga övningar.');
          }

          // Create workout session.
          const workoutSession = await tx.workoutSession.create({
            data: {
              userId,
              workoutId,
              workoutScheduleId: workoutScheduleId ?? null,
              workoutName: workout.name,
              workoutDescription: workout.description,
              startedAt: new Date(),
              activeKey,
            },
          });

          // Collect all sets for bulk insertion.
          const setsToCreate: Prisma.WorkoutSessionSetCreateManyInput[] = [];

          // Create session exercises.
          for (const workoutExercise of workout.exercises) {
            const exercise = workoutExercise.exercise;

            const primaryMuscle = exercise.muscles.find((muscle) => muscle.role === 'PRIMARY')?.muscleGroup.name ?? '';

            const secondaryMuscles = exercise.muscles.filter((muscle) => muscle.role === 'SECONDARY').map((muscle) => muscle.muscleGroup.name);

            const sessionExercise = await tx.workoutSessionExercise.create({
              data: {
                workoutSessionId: workoutSession.id,
                workoutExerciseId: workoutExercise.id,
                order: workoutExercise.order,

                // Exercise snapshots.
                exerciseName: exercise.name,
                exerciseImagePath: exercise.imagePath,
                exerciseEquipment: exercise.equipment,
                exerciseDescription: exercise.description,
                exerciseInstructions: exercise.instructions,
                exerciseTechniqueTips: exercise.techniqueTips,
                primaryMuscle,
                secondaryMuscles: JSON.stringify(secondaryMuscles),
              },
            });

            // Prepare sets for bulk insertion.
            for (let setNumber = 1; setNumber <= workoutExercise.sets; setNumber++) {
              setsToCreate.push({
                workoutSessionExerciseId: sessionExercise.id,
                setNumber,
                targetReps: workoutExercise.reps ?? 0,
                targetSeconds: workoutExercise.seconds ?? null,
                targetWeight: workoutExercise.weight,
                actualReps: null,
                actualSeconds: null,
                actualWeight: null,
              });
            }
          }

          // Insert all workout session sets in one operation.
          if (setsToCreate.length > 0) {
            await tx.workoutSessionSet.createMany({
              data: setsToCreate,
            });
          }

          return workoutSession;
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      );
    } catch (error: unknown) {
      // Handle only Prisma unique constraint conflicts.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const activeSession = await prisma.workoutSession.findFirst({
          where: {
            userId,
            activeKey,
            status: 'ACTIVE',
          },
        });

        if (activeSession) {
          return activeSession;
        }
      }

      throw error;
    }
  }

  async getById(id: number, userId: number): Promise<SessionWithDetails | null> {
    return prisma.workoutSession.findFirst({
      where: {
        id,
        userId,
      },
      include: sessionDetailsInclude,
    });
  }

  async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number, userId: number): Promise<WorkoutSessionSet | null> {
    return prisma.$transaction(async (tx): Promise<WorkoutSessionSet | null> => {
      const result = await tx.workoutSessionSet.updateMany({
        where: {
          id,
          workoutSessionExercise: {
            workoutSession: {
              userId,
              status: 'ACTIVE',
            },
          },
        },
        data: {
          actualReps,
          actualWeight,
          actualSeconds,
          completed: true,
          completedAt: new Date(),
        },
      });

      if (result.count === 0) {
        return null;
      }

      return tx.workoutSessionSet.findFirst({
        where: {
          id,
          workoutSessionExercise: {
            workoutSession: {
              userId,
              status: 'ACTIVE',
            },
          },
        },
      });
    });
  }

  async finish(id: number, userId: number): Promise<WorkoutSession | null> {
    return prisma.$transaction(async (tx): Promise<WorkoutSession | null> => {
      const result = await tx.workoutSession.updateMany({
        where: {
          id,
          userId,
          status: 'ACTIVE',
        },
        data: {
          status: 'COMPLETED',
          finishedAt: new Date(),
          activeKey: null,
        },
      });

      if (result.count === 0) {
        return null;
      }

      return tx.workoutSession.findFirst({
        where: {
          id,
          userId,
        },
      });
    });
  }

  async getCompeletedWorkoutSessiosn(userId: number): Promise<WorkoutSession[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async updateWorkoutSessionsStatus(workoutSessionId: number, userId: number): Promise<boolean> {
    const result = await prisma.workoutSession.updateMany({
      where: {
        id: workoutSessionId,
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'NOTCOMPLETED',
        activeKey: null,
      },
    });

    return result.count > 0;
  }

  async getLatestByWorkoutId(workoutId: number, userId: number): Promise<SessionWithSets | null> {
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
      },
      orderBy: {
        startedAt: 'desc',
      },
      include: sessionWithSetsInclude,
    });
  }

  async getLatestCompletedByWorkoutId(workoutId: number, userId: number): Promise<SessionWithDetails | null> {
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        finishedAt: 'desc',
      },
      include: sessionDetailsInclude,
    });
  }

  async getPreviousCompletedByWorkoutId(workoutId: number, userId: number, currentSessionId: number): Promise<SessionWithDetails | null> {
    const currentSession = await prisma.workoutSession.findFirst({
      where: {
        id: currentSessionId,
        workoutId,
        userId,
        status: 'COMPLETED',
        finishedAt: {
          not: null,
        },
      },
      select: {
        finishedAt: true,
      },
    });

    if (!currentSession?.finishedAt) {
      return null;
    }

    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
        status: 'COMPLETED',
        finishedAt: {
          lt: currentSession.finishedAt,
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
      include: sessionDetailsInclude,
    });
  }

  async getPreviousCompletedSessions(userId: number, currentSessionId: number, currentFinishedAt: Date): Promise<SessionWithDetails[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        id: {
          not: currentSessionId,
        },
        finishedAt: {
          not: null,
          lt: currentFinishedAt,
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
      include: sessionDetailsInclude,
    });
  }
}
