export interface WorkoutExercise {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  note: string;
}

export interface RegisterWorkoutDto {
  name: string;
  description: string;
  note: string;
  workoutExercises: WorkoutExercise[];
}
