import { Decimal } from '@prisma/client/runtime/library';

export interface EditWorkoutExerciseDto {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  note: string | null;
}

export interface EditWorkoutDto {
  name: string;
  description: string;
  workoutExercises: EditWorkoutExerciseDto[];
}
