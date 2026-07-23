export interface RegisterWorkoutDto {
  name: string;
  description: string;
  workoutExercises: RegisterWorkoutExerciseDto[];
}

export interface RegisterWorkoutExerciseDto {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  note: string;
}

export interface CreateWorkoutExerciseDto {
  workoutId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  note: string;
  order: number;
}
