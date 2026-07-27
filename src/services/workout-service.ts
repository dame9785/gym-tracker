import type ExerciseViewModel from '@/view-models/excercise-view-model';
import type { RegisterWorkoutDto } from '@/dto/register-workout-dto';

export interface DeleteWorkoutResponse {
  success: boolean;
  message: string;
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
