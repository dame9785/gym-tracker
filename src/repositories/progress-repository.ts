//Prisma
import { prisma } from '@/lib/prisma';

export class ProgressRepository {
  async getWeightProgress(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        goalWeight: true,
        weightLogs: {
          orderBy: {
            loggedAt: 'asc',
          },
          take: 1,
          select: {
            weight: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const latestWeightLog = await prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
      select: {
        weight: true,
      },
    });

    if (user.weightLogs.length === 0 || !latestWeightLog) {
      return null;
    }

    return {
      startWeight: Number(user.weightLogs[0].weight),
      currentWeight: Number(latestWeightLog.weight),
      goalWeight: Number(user.goalWeight),
    };
  }

  async getExerciseProgress(userId: number) {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        finishedAt: 'asc',
      },
      select: {
        finishedAt: true,

        exercises: {
          select: {
            workoutExercise: {
              select: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },

            sets: {
              where: {
                completed: true,
              },
              select: {
                actualReps: true,
                actualWeight: true,
              },
            },
          },
        },
      },
    });

    return sessions;
  }
}
