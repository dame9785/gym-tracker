//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

//Next Redirect
import { ApiErrorResponse, ApiResponse, WorkoutSchedelueCreateResponse } from '@/types/api-types';

const API_URL = 'http://localhost:3000/api/workout-schedules';

export default class WorkoutScheduleService {
  static async create(dto: RegisterWorkoutScheduleDto): Promise<ApiResponse<WorkoutSchedelueCreateResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = await response.json();
      return result as ApiResponse<WorkoutSchedelueCreateResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  static async getByMonth(userId: number, year: number, month: number): Promise<CalendarWorkoutViewModel[]> {
    try {
      const response = await fetch(`/api/workout-schedules?userId=${userId}&year=${year}&month=${month}`);

      if (!response.ok) {
        const text = await response.text();
        console.error(text);

        return [];
      }

      const data = await response.json();

      return data.workoutSchedules;
    } catch (error) {
      console.error('WorkoutScheduleService.getByMonth ERROR:', error);

      return [];
    }
  }
}
