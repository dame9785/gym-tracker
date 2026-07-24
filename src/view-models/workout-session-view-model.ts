import { WorkoutSessionExerciseViewModel } from './workout-session-exercise-view-model';

export interface WorkoutSessionViewModel {
  id: number;

  workoutId: number;

  startedAt: Date;
  finishedAt: Date | null;

  status: string;

  exercises: WorkoutSessionExerciseViewModel[];
}
