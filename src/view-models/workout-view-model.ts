export interface WorkoutListItemViewModel {
  id: number;
  name: string;
  description?: string | null;
}

export interface WorkoutExerciseViewModel {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  restSeconds?: number | null;
  order: number;
}

export interface WorkoutViewModel {
  id: number;
  name: string;
  description?: string | null;
  exercises: WorkoutExerciseViewModel[];
}
