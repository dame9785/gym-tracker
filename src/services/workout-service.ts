//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import {
  ApiErrorResponse,
  ApiResponse,
  WorkoutApiDeleteResponse,
  WorkoutApiGetByIdResponse,
  WorkoutApiResponse,
  WorkoutApiUpdateResponse,
} from '@/types/api-types';
import type { ExerciseViewModel } from '@/types/exercise-types';
import type {
  GetWorkoutResponse,
  EditWorkoutResponse,
  EditWorkoutDto,
  RegisterWorkoutDto,
} from '@/types/workout-types';

//Next Redirect
import { redirect } from 'next/navigation';

//API URL
const API_URL = 'http://localhost:3000/api/workouts';

export default class WorkoutService {
  static async get(): Promise<ExerciseViewModel[]> {
    try {
      const response = await fetch('/api/exercises', {
        method: 'GET',
      });

      const exerices = response.json();
      return exerices;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  static async create(dto: RegisterWorkoutDto) {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  static async getAll(): Promise<ApiResponse<WorkoutApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      const result = await response.json();
      return result as ApiResponse<WorkoutApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
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
      const result = await response.json();
      console.log(result);
      return result as ApiResponse<WorkoutApiUpdateResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //GET: Workout/{id}
  static async getById(id: number): Promise<ApiResponse<WorkoutApiGetByIdResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });

      const result = await response.json();
      return result as ApiResponse<WorkoutApiGetByIdResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //DELETE: Workout
  static async delete(id: number): Promise<ApiResponse<WorkoutApiDeleteResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      return result as ApiResponse<WorkoutApiDeleteResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }
}
