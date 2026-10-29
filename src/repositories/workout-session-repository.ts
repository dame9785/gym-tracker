//Prisma
import { prisma } from '@/lib/prisma';

//Repository
import { WorkoutRepository } from './workout-repository';

export class WorkoutSessionRepository {
  private workoutRepository = new WorkoutRepository();

  async create(workoutId: number, userId: number) {
    const workout = await this.workoutRepository.getById(workoutId, userId);

    if (!workout) {
      throw new Error('Workout hittades inte.');
    }

    if (workout.exercises.length === 0) {
      throw new Error('Workout innehåller inga övningar.');
    }

    const activeKey = `${userId}:${workoutId}`;

    // Snabb kontroll innan vi försöker skapa en ny session.
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        userId,
        workoutId,
        status: 'ACTIVE',
      },
    });

    if (existingSession) {
      return existingSession;
    }

    try {
      return await prisma.$transaction(async (tx) => {
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
    } catch (error) {
      // Ett parallellt anrop kan ha hunnit skapa sessionen först.
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

      throw error;
    }
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

  async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number, userId: number) {
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

  async finish(id: number, userId: number) {
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
