//Prisma
import { prisma } from '@/lib/prisma';

//Repository
import { WorkoutRepository } from './workout-repository';

export class WorkoutSessionRepository {
  private workoutRepository = new WorkoutRepository();
  async create(workoutId: number, userId: number) {
    const activeSession = await prisma.workoutSession.findFirst({
      where: {
        userId,
        workoutId,
        status: 'ACTIVE',
      },
    });

    if (activeSession) {
      return activeSession;
    }
    const workout = await this.workoutRepository.getById(workoutId, userId);

    if (!workout) {
      throw new Error('Workout hittades inte.');
    }

    if (workout.exercises.length === 0) {
      throw new Error('Workout innehåller inga övningar.');
    }

    return await prisma.$transaction(async (tx) => {
      const workoutSession = await tx.workoutSession.create({
        data: {
          userId,
          workoutId,
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
  }

  async getById(id: number, userId: number) {
    const data = await prisma.workoutSession.findFirst({
      where: {
        id,
        userId,
      },
      include: {
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
      },
    });

    return data;
  }

  async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number) {
    return await prisma.workoutSessionSet.update({
      where: {
        id,
      },
      data: {
        actualReps,
        actualWeight,
        actualSeconds,
        completed: true,
      },
    });
  }

  async finish(id: number) {
    console.log('🔥 REPOSITORY FINISH:', id);

    const result = await prisma.workoutSession.update({
      where: {
        id,
      },
      data: {
        status: 'COMPLETED',
        finishedAt: new Date(),
      },
    });

    console.log('🔥 PRISMA RESULT:', result);

    return result;
  }

  async getCompeletedWorkoutSessiosn(userId: number) {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    return sessions;
  }

  async updateWorkoutSessionsStatus(workoutSessionId: number): Promise<boolean> {
    const result = await prisma.workoutSession.updateMany({
      where: {
        id: workoutSessionId,
        status: 'ACTIVE',
      },
      data: {
        status: 'NOTCOMPLETED',
      },
    });

    return result.count > 0;
  }

  async getLatestByWorkoutId(workoutId: number, userId: number) {
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
      },
      orderBy: {
        startedAt: 'desc',
      },
      include: {
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
      },
    });
  }

  async getLatestCompletedByWorkoutId(workoutId: number, userId: number) {
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        finishedAt: 'desc',
      },
      include: {
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
      },
    });
  }

  async getPreviousCompletedByWorkoutId(workoutId: number, userId: number, currentSessionId: number) {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        workoutId,
        userId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        workoutId: true,
        userId: true,
        status: true,
        startedAt: true,
        finishedAt: true,
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });

    console.log('ALL SESSIONS FOR WORKOUT:', sessions);
    console.log('Completed sessions for workout:', sessions);
    console.log('Current session ID to exclude:', currentSessionId);

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
      include: {
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
      },
    });
  }
  async debugCompletedSessions(userId: number) {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        workoutId: true,
        userId: true,
        status: true,
        startedAt: true,
        finishedAt: true,
        workout: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });
  }

  async getPreviousCompletedSessions(userId: number, currentSessionId: number, currentFinishedAt: Date) {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        id: { not: currentSessionId },
        finishedAt: {
          not: null,
          lt: currentFinishedAt,
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
      include: {
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
      },
    });
  }
}
