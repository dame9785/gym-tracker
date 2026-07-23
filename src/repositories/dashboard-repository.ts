import { prisma } from '@/lib/prisma';

export class DashboardRepository {
  async getWeeklyOverview() {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await prisma.workoutSchedule.findMany({
      where: {
        userId: 15,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        workout: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
