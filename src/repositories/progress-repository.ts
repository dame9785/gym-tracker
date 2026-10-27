//Prisma
import { prisma } from '@/lib/prisma';

export class ProgressRepository {
  async getWeightProgress(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        goalWeight: true,
        weightLogs: {
          orderBy: { loggedAt: 'asc' },
          select: {
            weight: true,
            loggedAt: true,
          },
        },
      },
    });

    if (!user || user.weightLogs.length === 0) {
      return null;
    }

    const history = user.weightLogs.map((log) => ({
      weight: Number(log.weight),
      loggedAt: log.loggedAt.toISOString(),
    }));

    const firstWeightLog = user.weightLogs[0];
    const latestWeightLog = user.weightLogs[user.weightLogs.length - 1];

    return {
      startWeight: Number(firstWeightLog.weight),
      currentWeight: Number(latestWeightLog.weight),
      goalWeight: Number(user.goalWeight),
      history,
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
