import { prisma } from '@/lib/prisma';

export class DashboardRepository {
  async getWeeklyOverview(userId: number) {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Sunday belongs to the same week as the preceding Monday.
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

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
