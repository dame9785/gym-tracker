import { WorkoutListItemViewModel } from '@/view-models/workout-view-model';

export interface WorkoutResponse {
  success: boolean;
  workouts: WorkoutListItemViewModel[];
  message?: string;
}
