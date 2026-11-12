import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// Prisma includes
// --------------------------------------------------

const historyInclude = {
  exercises: {
    include: {
      sets: {
        orderBy: {
          setNumber: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.WorkoutSessionInclude;

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type WorkoutSession = Prisma.WorkoutSessionGetPayload<Record<string, never>>;

type WorkoutSessionWithExercises = Prisma.WorkoutSessionGetPayload<{
  include: typeof historyInclude;
}>;

type CompletedSessionDebug = Prisma.WorkoutSessionGetPayload<{
  select: {
    id: true;
    workoutId: true;
    workoutName: true;
    status: true;
    startedAt: true;
    finishedAt: true;
  };
}>;

type WorkoutSessionForStreak = Prisma.WorkoutSessionGetPayload<{
  select: {
    id: true;
    status: true;
    startedAt: true;
    finishedAt: true;
  };
}>;

type TotalTrainingTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class HistoryRepository {
  // Get ALL workout sessions, regardless of status.
  // Historical data is read from session snapshots.
  async getAllWorkoutSessions(userId: number, page: number, pageSize: number): Promise<WorkoutSessionWithExercises[]> {
    const skip = (page - 1) * pageSize;

    return prisma.workoutSession.findMany({
      where: {
        userId,
      },
      include: historyInclude,
      orderBy: {
        startedAt: 'desc',
      },
      skip,
      take: pageSize,
    });
  }

  // Get completed workout sessions only.
  // Historical data is read from session snapshots.
  async getCompletedWorkoutSessions(userId: number, page: number, pageSize: number): Promise<WorkoutSessionWithExercises[]> {
    const skip = (page - 1) * pageSize;

    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      include: historyInclude,
      orderBy: {
        finishedAt: 'desc',
      },
      skip,
      take: pageSize,
    });
  }

  // Count all workout sessions.
  async getAllWorkoutSessionsCount(userId: number): Promise<number> {
    return prisma.workoutSession.count({
      where: {
        userId,
      },
    });
  }

  // Count completed workout sessions.
  async getTotalCompletedWorkout(userId: number): Promise<number> {
    return prisma.workoutSession.count({
      where: {
        userId,
        status: 'COMPLETED',
      },
    });
  }

  // Calculate total training time.
  async getTotalTrainingTime(userId: number): Promise<TotalTrainingTime> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        finishedAt: {
          not: null,
        },
      },
      select: {
        startedAt: true,
        finishedAt: true,
      },
    });

    let totalSeconds = 0;

    sessions.forEach((session) => {
      if (session.finishedAt) {
        const duration = session.finishedAt.getTime() - session.startedAt.getTime();

        totalSeconds += Math.max(0, Math.floor(duration / 1000));
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
    };
  }

  // Count completed sets only.
  async getTotalSets(userId: number): Promise<number> {
    return prisma.workoutSessionSet.count({
      where: {
        completed: true,
        workoutSessionExercise: {
          workoutSession: {
            userId,
            status: 'COMPLETED',
          },
        },
      },
    });
  }

  // Get completed workout sessions without pagination.
  async getWorkoutSessions(userId: number): Promise<WorkoutSession[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });
  }

  // Debug completed sessions.
  async debugCompletedSessions(userId: number): Promise<CompletedSessionDebug[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        workoutId: true,
        workoutName: true,
        status: true,
        startedAt: true,
        finishedAt: true,
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });
  }

  // Get workout sessions for streak calculation, regardless of status.
  async getWorkoutSessionsForStreak(userId: number): Promise<WorkoutSessionForStreak[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
        finishedAt: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }
}
