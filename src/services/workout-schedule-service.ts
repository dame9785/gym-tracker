import type { RegisterWorkoutScheduleDto } from '@/types/workout-schedule-types';
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';
import { schedelueWorkoutSchema } from '@/schemas/schedelue-workout-schemas';
import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

export class WorkoutScheduleService {
  private readonly workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto, userId: number): Promise<Awaited<ReturnType<WorkoutScheduleRepository['create']>>> {
    const validation = schedelueWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    return this.workoutScheduleRepository.create(
      {
        ...validation.data,
        date: validation.data.date,
      },
      userId,
    );
  }

  async getByMonth(userId: number, year: number, month: number): Promise<WeeklyWorkoutViewModel[]> {
    const workoutSchedules = await this.workoutScheduleRepository.getByMonth(userId, year, month);

    return mapWeeklyOverview(workoutSchedules);
  }
}
