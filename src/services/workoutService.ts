import type { ExerciseViewModel } from '@/view-models/ExcerciseViewModel';
import type { RegisterWorkoutDto } from '@/dto/register-workout-dto';

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
}
