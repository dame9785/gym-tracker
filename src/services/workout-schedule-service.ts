//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

//Next Redirect
import { ApiErrorResponse, ApiResponse, WorkoutSchedelueCreateResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

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
      return errorResponse('Could not connect to the server.');
    }
  }

  static async getByMonth(userToken: string, year: number, month: number): Promise<CalendarWorkoutViewModel[]> {
    try {
      const response = await fetch(`/api/workout-schedules?&year=${year}&month=${month}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

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
