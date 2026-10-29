import { prisma } from '@/lib/prisma';
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

export class WorkoutScheduleRepository {
  async create(dto: RegisterWorkoutScheduleDto, userId: number): Promise<Awaited<ReturnType<typeof prisma.workoutSchedule.create>>> {
    return prisma.workoutSchedule.create({
      data: {
        userId,
        workoutId: dto.workoutId,
        date: new Date(dto.date),
      },
    });
  }

  async getByMonth(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    return prisma.workoutSchedule.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
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
