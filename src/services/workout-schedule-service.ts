//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';

import { errorResponse } from '@/utils/api-error';

const API_URL = '/api/workout-schedules';

export default class WorkoutScheduleService {
  static async create(dto: RegisterWorkoutScheduleDto) {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  static async getByMonth(userToken: string, year: number, month: number): Promise<CalendarWorkoutViewModel[]> {
    try {
      const response = await fetch(`/api/workout-schedules?year=${year}&month=${month}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workout schedules: ${response.status}`);
      }

      const data = await response.json();

      // API returns an object containing workoutSchedules
      if (Array.isArray(data.workoutSchedules)) {
        return data.workoutSchedules;
      }

      // Also support an API that returns an array directly
      if (Array.isArray(data)) {
        return data;
      }

      console.error('Unexpected workout schedule response:', data);
      return [];
    } catch (error) {
      console.error('Failed to fetch workout schedules:', error);
      return [];
    }
  }
}
