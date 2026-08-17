//Types
import { ApiErrorResponse, ApiResponse, WorkoutApiResponse } from '@/types/api-types';
import type { ExerciseViewModel } from '@/types/exercise-types';
import type {
  DeleteWorkoutResponse,
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

      const result: ApiResponse<WorkoutApiResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //Update Workout
  static async update(id: number, dto: EditWorkoutDto): Promise<EditWorkoutResponse> {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result: EditWorkoutResponse = await response.json();
      if (!result.success) {
        return {
          success: false,
          message: 'Något gick fel, gick inte hämta träningspass',
          workout: [],
        };
      }

      return result as EditWorkoutResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //GET: Workout/{id}
  static async getById(id: number): Promise<GetWorkoutResponse> {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Något gick fel, gick inte hämta träningspass',
          workout: null as never, // eller gör workout valfri, se nedan
        };
      }
      return (await response.json()) as GetWorkoutResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //DELETE: Workout
  static async delete(id: number) {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Något gick fel, träningspass blev ej borttagen',
        };
      }

      return (await response.json()) as DeleteWorkoutResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
