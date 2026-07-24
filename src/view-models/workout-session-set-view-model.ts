export interface WorkoutSessionSetViewModel {
  id: number;
  setNumber: number;

  targetReps: number;
  targetWeight: number | null;

  actualReps: number | null;
  actualWeight: number | null;

  completed: boolean;
}
