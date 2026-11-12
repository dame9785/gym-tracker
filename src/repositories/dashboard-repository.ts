import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

const weeklyOverviewInclude = {
  sessions: {
    orderBy: {
      startedAt: 'desc',
    },
    take: 1,
  },
  workout: {
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  },
} satisfies Prisma.WorkoutScheduleInclude;

const plannedWorkoutsInclude = {
  sessions: {
    orderBy: {
      startedAt: 'desc',
    },
    take: 1,
  },
  workout: {
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  },
} satisfies Prisma.WorkoutScheduleInclude;

type WeeklyOverview = Prisma.WorkoutScheduleGetPayload<{
  include: typeof weeklyOverviewInclude;
}>;

type PlannedWorkout = Prisma.WorkoutScheduleGetPayload<{
  include: typeof plannedWorkoutsInclude;
}>;

export class DashboardRepository {
  async getWeeklyOverview(userId: number): Promise<WeeklyOverview[]> {
    const today = new Date();
    const startOfWeek = new Date(today);

    // Monday is the first day of the week.
    const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;

    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return prisma.workoutSchedule.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
      include: weeklyOverviewInclude,
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getAllPlannedWorkouts(userId: number): Promise<PlannedWorkout[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.workoutSchedule.findMany({
      where: {
        userId,
        date: {
          gte: today,
        },
        sessions: {
          none: {
            userId,
            status: {
              in: ['COMPLETED', 'NOTCOMPLETED'],
            },
          },
        },
      },
      include: plannedWorkoutsInclude,
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getMonthlyCompletedWorkouts(userId: number): Promise<number> {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return prisma.workoutSession.count({
      where: {
        userId,
        status: 'COMPLETED',
        finishedAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });
  }
}
