import { WorkoutSessionSetViewModel } from './workout-session-set-view-model';

export interface WorkoutSessionExerciseViewModel {
  id: number;

  name: string;
  muscleGroup: string;
  equipment: string | null;

  order: number;
  note: string | null;

  sets: WorkoutSessionSetViewModel[];
}
