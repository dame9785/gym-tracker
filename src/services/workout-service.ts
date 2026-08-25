//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import {
  ApiResponse,
  WorkoutApiDeleteResponse,
  WorkoutApiGetByIdResponse,
  WorkoutApiRegisterResponse,
  WorkoutApiResponse,
  WorkoutApiUpdateResponse,
} from '@/types/api-types';

import type { RegisterWorkoutDto } from '@/types/workout-types';
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/workouts';

export default class WorkoutService {
  //POST: /api/workout
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

      const result = (await response.json()) as ApiResponse<WorkoutApiRegisterResponse>;
      return result;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }

  //GET: /api/workout
  static async getAll(userToken: string, page: number): Promise<ApiResponse<WorkoutApiResponse>> {
    try {
      const response = await fetch(`${API_URL}?page=${page}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiResponse<WorkoutApiResponse>;
      return result;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }

  //PUT: /api/workout
  static async update(id: number, dto: UpdateWorkoutDto): Promise<ApiResponse<WorkoutApiUpdateResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<WorkoutApiUpdateResponse>;
      return result;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }

  //PUT: /api/workout/id
  static async getById(id: number, userToken: string): Promise<ApiResponse<WorkoutApiGetByIdResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiResponse<WorkoutApiGetByIdResponse>;
      return result;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }

  //DELETE: /api/workout/id
  static async delete(id: number): Promise<ApiResponse<WorkoutApiDeleteResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      const result = (await response.json()) as ApiResponse<WorkoutApiDeleteResponse>;
      return result;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }
}
