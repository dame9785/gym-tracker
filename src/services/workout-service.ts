import type { WorkoutViewModel } from '@/view-models/workout-view-model';
import type ExerciseViewModel from '@/view-models/excercise-view-model';
import type { RegisterWorkoutDto } from '@/dto/register-workout-dto';
import { EditWorkoutViewModel } from '@/view-models/workout-edit-view-model';
import type { EditWorkoutDto } from '@/dto/edit-workout-dto';

export interface DeleteWorkoutResponse {
  success: boolean;
  message: string;
}

export interface GetWorkoutResponse {
  success: boolean;
  message: string;
  workout: EditWorkoutViewModel;
}

export interface EditWorkoutResponse {
  success: boolean;
  message: string;
  workout: WorkoutViewModel[];
}

export default class WorkoutService {
  static async get(): Promise<ExerciseViewModel[]> {
    const response = await fetch('/api/exercises', {
      method: 'GET',
    });

    const exerices = response.json();
    return exerices;
  }

  static async create(dto: RegisterWorkoutDto) {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    return await response.json();
  }

  static async getAll() {
    const response = await fetch('/api/workouts', {
      method: 'GET',
    });

    return await response.json();
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
      return {
        message: 'Något gick fel, gick inte hämta träningspass',
        success: false,
        workout: [],
      };
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
      return {
        success: false,
        message: 'Något gick fel, gick inte hämta träningspass',
        workout: null as never, // eller gör workout valfri, se nedan
      };
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
      return {
        success: false,
        message: 'Något gick fel, träningspass blev ej borttagen',
      };
    }
  }
}
