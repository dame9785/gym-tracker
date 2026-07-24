import { prisma } from '@/lib/prisma';
import { RegisterWorkoutScheduleDto } from '@/dto/register-workout-schedule-dto';
import { WorkoutSessionStatus } from '@prisma/client';

export class WorkoutScheduleRepository {
  async create(dto: RegisterWorkoutScheduleDto) {
    const workoutSchedule = await prisma.workoutSchedule.create({
      data: {
        userId: 15, // Tillfälligt, senare hämtas från den inloggade användaren
        workoutId: dto.workoutId,
        date: new Date(dto.date),
        status: WorkoutSessionStatus.ACTIVE,
      },
    });

    return workoutSchedule;
  }
}
