import type { ExerciseViewModel } from '@/view-models/ExcerciseViewModel';

interface WorkoutExercise {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  note: string;
}

interface RegisterWorkoutFormData {
  name: string;
  description: string;
  note: string;
  workoutExercises: WorkoutExercise[];
}

export default class WorkoutService {
  static async get(): Promise<ExerciseViewModel[]> {
    const response = await fetch('/api/exercises', {
      method: 'GET',
    });

    const exerices = response.json();
    return exerices;
  }

  static async create(dto: RegisterWorkoutFormData) {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    return await response.json();
  }
}
