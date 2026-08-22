export interface ProgressApiResponse {
  weightProgress: WeightProgress | null;
  exerciseProgress: ExerciseProgress[];
}

export interface WeightProgress {
  currentWeight: number;
  startWeight: number;
  goalWeight: number;
}

export interface ExerciseProgress {
  exerciseId: number;
  exerciseName: string;
  history: ExerciseProgressEntry[];
}

export interface ExerciseProgressEntry {
  weight: number;
  reps: number;
  loggedAt: string;
}
