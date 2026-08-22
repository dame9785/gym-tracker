//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import { ApiResponse, WorkoutApiDeleteResponse, WorkoutApiGetByIdResponse, WorkoutApiRegisterResponse, WorkoutApiResponse, WorkoutApiUpdateResponse } from '@/types/api-types';

import type { RegisterWorkoutDto } from '@/types/workout-types';
import { errorResponse } from '@/utils/api-responses';

//API URL
const API_URL = 'http://localhost:3000/api/workouts';

export default class WorkoutService {
  static async create(dto: RegisterWorkoutDto, userToken: string): Promise<ApiResponse<WorkoutApiRegisterResponse>> {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiResponse<WorkoutApiRegisterResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async getAll(userToken: string): Promise<ApiResponse<WorkoutApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiResponse<WorkoutApiResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //Update Workout
  static async update(id: number, dto: UpdateWorkoutDto): Promise<ApiResponse<WorkoutApiUpdateResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();

      return result as ApiResponse<WorkoutApiUpdateResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //GET: Workout/{id}
  static async getById(id: number): Promise<ApiResponse<WorkoutApiGetByIdResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiResponse<WorkoutApiGetByIdResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //DELETE: Workout
  static async delete(id: number): Promise<ApiResponse<WorkoutApiDeleteResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiResponse<WorkoutApiDeleteResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
