export interface ProgressApiResponse {
  weightProgress: WeightProgress | null;
  exerciseProgress: ExerciseProgress[];
}

export interface WeightProgress {
  currentWeight: number;
  startWeight: number;
  goalWeight: number;
  history: WeightProgressEntry[];
}

export interface WeightProgressEntry {
  weight: number;
  loggedAt: string;
}

export interface ExerciseProgress {
  exerciseId: number;
  exerciseName: string;
  equipment: string | null;
  history: ExerciseProgressEntry[];
}

export interface ExerciseProgressEntry {
  weight: number;
  reps: number;
  seconds?: number;
  loggedAt: string;
}
