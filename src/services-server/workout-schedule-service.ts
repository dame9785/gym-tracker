//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

//Repository
import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutSchedelueCreateResponse } from '@/types/api-types';
import { SchedelueWorkoutDto, schedelueWorkoutSchema } from '@/schemas/schedelue-workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';

export class WorkoutScheduleService {
  private workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto): Promise<ApiResponse<WorkoutSchedelueCreateResponse>> {
    try {
      const workoutSchedule = await this.workoutScheduleRepository.create(dto);

      //Validation
      const validation = schedelueWorkoutSchema.safeParse(dto);
      if (!validation.success) {
        const fieldErrors = ErrorsHelper.getFormErrors<SchedelueWorkoutDto>(validation.error.issues);
        const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

        return {
          success: false,
          message: 'Felaktig email eller lösenord.',
          errors: errors,
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        message: 'Träningspass planerat.',
        data: {
          workoutSchedule: workoutSchedule,
        },
      } satisfies ApiSuccessResponse<WorkoutSchedelueCreateResponse>;
    } catch (error) {
      console.error('WorkoutScheduleService.create ERROR:', error);

      return {
        success: false,
        message: 'Något gick fel, server fel',
      } satisfies ApiErrorResponse;
    }
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
