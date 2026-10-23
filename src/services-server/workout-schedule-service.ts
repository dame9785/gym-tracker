//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

//Repository
import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';
import { ErrorResponse } from '@/types/api-types';
import { SchedelueWorkoutDto, schedelueWorkoutSchema } from '@/schemas/schedelue-workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';

export class WorkoutScheduleService {
  private workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto, userId: number) {
    try {
      console.log('Workout schedule DTO:', dto);
      console.log('User ID:', userId);

      // 1. Validate DTO before accessing the database
      const validation = schedelueWorkoutSchema.safeParse(dto);

      if (!validation.success) {
        console.error('Workout schedule validation failed:', validation.error.issues);

        const fieldErrors = ErrorsHelper.getFormErrors<SchedelueWorkoutDto>(validation.error.issues);

        const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

        return {
          success: false,
          message: 'Ogiltiga uppgifter för träningsschemat.',
          errors,
        } satisfies ErrorResponse;
      }

      // 2. Create schedule only after successful validation
      const workoutSchedule = await this.workoutScheduleRepository.create(dto, userId);

      return {
        success: true,
        workoutSchedule,
      };
    } catch (error) {
      console.error('WorkoutScheduleService.create ERROR:', error);

      return {
        success: false,
        message: 'Kunde inte schemalägga träningspasset.',
      } satisfies ErrorResponse;
    }
  }

  async getByMonth(userId: number, year: number, month: number): Promise<CalendarWorkoutViewModel[]> {
    const workoutSchedules = await this.workoutScheduleRepository.getByMonth(userId, year, month);
    console.log(workoutSchedules);

    return workoutSchedules.map((schedule) => ({
      id: schedule.id,
      date: schedule.date.toISOString(),
      workoutId: schedule.workoutId,
      workoutName: schedule.workout.name,
    }));
  }
}
