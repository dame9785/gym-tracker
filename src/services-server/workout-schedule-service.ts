//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

//Repository
import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutSchedelueCreateResponse } from '@/types/api-types';

export class WorkoutScheduleService {
  private workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto): Promise<ApiResponse<WorkoutSchedelueCreateResponse>> {
    try {
      const workoutSchedule = await this.workoutScheduleRepository.create(dto);

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
