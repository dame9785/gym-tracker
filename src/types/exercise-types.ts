import { WorkoutSessionSetViewModel } from '@/types/workout-types';

export interface Exercise {
  exerciseId: number;
}

export interface ExerciseViewModel {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string | null;
}

export interface RegisterExerciseDto {
  name: string;
  muscleGroup: string;
  equipment: string;
}

export interface EditWorkoutExerciseDto {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  order: number;
  weight: number | null;
  note: string | null;
}

export interface RegisterWorkoutExerciseDto {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number | null;
  note: string;
}

export interface WorkoutExerciseViewModel {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  order: number;
  weight: number | null;
}

export interface WorkoutSessionExerciseViewModel {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  order: number;
  note: string | null;
  sets: WorkoutSessionSetViewModel[];
}

export interface ExerciseResponse {
  message: string;
  isSuccess: boolean;
}
