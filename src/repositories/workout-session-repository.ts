import { Prisma, type WorkoutSession, type WorkoutSessionSet } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { WorkoutRepository } from './workout-repository';

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

type SessionWithDetails = Prisma.WorkoutSessionGetPayload<{
  include: typeof sessionDetailsInclude;
}>;

type SessionWithSets = Prisma.WorkoutSessionGetPayload<{
  include: typeof sessionWithSetsInclude;
}>;

export class WorkoutSessionRepository {
  private workoutRepository = new WorkoutRepository();

  async create(workoutId: number, userId: number): Promise<WorkoutSession> {
    const workout = await this.workoutRepository.getById(workoutId, userId);

    if (!workout) {
      throw new Error('Workout hittades inte.');
    }

    if (workout.exercises.length === 0) {
      throw new Error('Workout innehåller inga övningar.');
    }

    const activeKey = `${userId}:${workoutId}`;

    // Återanvänd ett redan aktivt träningspass.
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        userId,
        workoutId,
        status: 'ACTIVE',
      },
    });

    if (existingSession) {
      // Säkerställ att äldre aktiva sessioner också har en activeKey.
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
      return await prisma.$transaction(async (tx): Promise<WorkoutSession> => {
        const workoutSession = await tx.workoutSession.create({
          data: {
            userId,
            workoutId,
            activeKey,
          },
        });

        for (const workoutExercise of workout.exercises) {
          const sessionExercise = await tx.workoutSessionExercise.create({
            data: {
              workoutSessionId: workoutSession.id,
              workoutExerciseId: workoutExercise.id,
              order: workoutExercise.order,
            },
          });

          for (let setNumber = 1; setNumber <= workoutExercise.sets; setNumber++) {
            await tx.workoutSessionSet.create({
              data: {
                workoutSessionExerciseId: sessionExercise.id,
                setNumber,
                targetReps: workoutExercise.reps ?? 0,
                targetSeconds: workoutExercise.seconds ?? null,
                targetWeight: workoutExercise.weight,
                actualReps: null,
                actualSeconds: null,
                actualWeight: null,
              },
            });
          }
        }

        return workoutSession;
      });
    } catch (error: unknown) {
      // Hantera endast Prisma-unikahetskonflikter.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const activeSession = await prisma.workoutSession.findFirst({
          where: {
            userId,
            workoutId,
            status: 'ACTIVE',
            activeKey,
          },
        });

        if (activeSession) {
          return activeSession;
        }
      }

      // Andra databasfel ska inte döljas.
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
    return prisma.$transaction(async (tx) => {
      const result = await tx.workoutSessionSet.updateMany({
        where: {
          id,
          workoutSessionExercise: {
            workoutSession: {
              userId,
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
            },
          },
        },
      });
    });
  }

  async finish(id: number, userId: number): Promise<WorkoutSession | null> {
    return prisma.$transaction(async (tx) => {
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
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
        status: 'COMPLETED',
        id: {
          not: currentSessionId,
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
