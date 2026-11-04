import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';
import { schedelueWorkoutSchema } from '@/schemas/schedelue-workout-schemas';

export class WorkoutScheduleService {
  private workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto, userId: number) {
    const validation = schedelueWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    return this.workoutScheduleRepository.create(
      {
        ...validation.data,
        date: validation.data.date.toISOString(),
      },
      userId,
    );
  }

  async getByMonth(userId: number, year: number, month: number): Promise<CalendarWorkoutViewModel[]> {
    const workoutSchedules = await this.workoutScheduleRepository.getByMonth(userId, year, month);

    return workoutSchedules.map((schedule) => ({
      id: schedule.id,
      date: schedule.date.toISOString(),
      workoutId: schedule.workoutId,
      workoutName: schedule.workout.name,
    }));
  }
}
