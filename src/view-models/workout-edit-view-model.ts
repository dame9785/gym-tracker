export interface WorkoutExerciseViewModel {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  note: string | null;
}

export interface EditWorkoutViewModel {
  name: string;
  description: string;
  workoutExercises: WorkoutExerciseViewModel[];
}
