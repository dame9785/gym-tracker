import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// Result types
// --------------------------------------------------

type WeightProgress = {
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  history: {
    weight: number;
    loggedAt: string;
  }[];
};

const exerciseProgressSelect = {
  finishedAt: true,
  exercises: {
    select: {
      workoutExercise: {
        select: {
          exercise: {
            select: {
              id: true,
              name: true,
              equipment: true,
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
          actualSeconds: true,
        },
      },
    },
  },
} satisfies Prisma.WorkoutSessionSelect;

type ExerciseProgress = Prisma.WorkoutSessionGetPayload<{
  select: typeof exerciseProgressSelect;
}>;

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class ProgressRepository {
  async getWeightProgress(userId: number): Promise<WeightProgress | null> {
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

  async getExerciseProgress(userId: number): Promise<ExerciseProgress[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        finishedAt: 'asc',
      },
      select: exerciseProgressSelect,
    });
  }
}
