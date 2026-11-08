import { prisma } from '@/lib/prisma';

export class DashboardRepository {
  async getWeeklyOverview(userId: number) {
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
      include: {
        sessions: {
          where: {
            userId,
          },
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
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getAllPlannedWorkouts(userId: number) {
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
            status: {
              in: ['COMPLETED', 'NOTCOMPLETED'],
            },
          },
        },
      },
      include: {
        sessions: {
          where: {
            userId,
          },
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
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
