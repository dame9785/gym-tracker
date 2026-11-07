import { prisma } from '@/lib/prisma';
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

export class WorkoutScheduleRepository {
  async create(dto: RegisterWorkoutScheduleDto, userId: number): Promise<Awaited<ReturnType<typeof prisma.workoutSchedule.create>>> {
    return prisma.$transaction(async (tx) => {
      const workout = await tx.workout.findFirst({
        where: {
          id: dto.workoutId,
          userId,
          archivedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!workout) {
        throw new Error('Workout not found or unavailable.');
      }

      return tx.workoutSchedule.create({
        data: {
          userId,
          workoutId: workout.id,
          date: new Date(dto.date),
        },
      });
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
        workout: {
          is: {
            archivedAt: null,
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
              where: {
                archivedAt: null,
              },
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
