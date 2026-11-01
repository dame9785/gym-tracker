import { prisma } from '@/lib/prisma';

export class DashboardRepository {
  async getWeeklyOverview(userId: number) {
    const today = new Date();

    const startOfWeek = new Date(today);

    // Monday is the first day of the week.
    // Sunday (0) must go back 6 days, not forward 1 day.
    const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;

    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Sunday belongs to the same week as the preceding Monday.
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
            sessions: {
              where: {
                userId,
              },
              orderBy: {
                startedAt: 'desc',
              },
              take: 1,
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
