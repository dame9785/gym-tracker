//Prisma
import { prisma } from '@/lib/prisma';

//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

export class WorkoutScheduleRepository {
  async create(dto: RegisterWorkoutScheduleDto) {
    const workoutSchedule = await prisma.workoutSchedule.create({
      data: {
        userId: 1, // Tillfälligt, senare hämtas från den inloggade användaren
        workoutId: dto.workoutId,
        date: new Date(dto.date),
      },
    });

    return workoutSchedule;
  }
}
