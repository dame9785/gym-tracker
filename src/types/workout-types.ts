//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import type { WorkoutSessionExerciseViewModel, WorkoutExerciseViewModel } from '@/types/exercise-types';

//Prisma
import { $Enums, WorkoutSessionStatus } from '@prisma/client';

export interface DeleteWorkoutResponse {
  success: boolean;
  message: string;
}

export interface GetWorkoutResponse {
  success: boolean;
  message: string;
  workout: EditWorkoutViewModel;
}

export interface EditWorkoutResponse {
  success: boolean;
  message: string;
  workout: WorkoutViewModel[];
}

export interface WorkoutViewModel {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  workoutExercises: WorkoutExercisesViewModel[];
}

export interface WorkoutExercisesViewModel {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  seconds: number;
  note: string;
  order: number;
}

export interface EditWorkoutDto {
  name: string;
  description: string;
  workoutExericses: WorkoutExerciseViewModel[];
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

export interface UpdateWorkoutSessionSetDto {
  actualReps: number;
  actualWeight: number;
}

export interface RegisterWorkoutScheduleDto {
  workoutId: number;
  date: string;
}

export interface RegisterWorkoutSessionDto {
  workoutId: number;
}

export interface EditWorkoutViewModel {
  id: number;
  name: string;
  description: string;
  workoutExercises: WorkoutExerciseViewModel[];
}

export interface WorkoutSessionViewModel {
  id: number;
  workoutId: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
  exercises: WorkoutSessionExerciseViewModel[];
}

export interface WorkoutSessionSetViewModel {
  id: number;
  setNumber: number;
  targetReps: number;
  targetWeight: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
}

export interface WeeklyWorkoutViewModel {
  id: number;
  workoutName: string;
  date: string;
  exerciseCount: number;
  estimatedMinutes: number;
  status: WorkoutSessionStatus;
  activeSessionId: number | null;
  exercises: WorkoutExerciseViewModel[];
}

export interface SelectedWorkoutProps {
  workout: WeeklyWorkoutViewModel;
}

export interface WorkoutResponse {
  success: boolean;
  workouts: WorkoutViewModel[];
  message?: string;
}

export interface WorkoutValidationResult {
  message: string;
  success: boolean;
}

export interface WorkoutSessionFinishViewModel {
  id: number;
  userId: number;
  workoutId: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: $Enums.WorkoutSessionStatus;
}

export interface WorkoutSchedelueViewModel {
  userId: number;
  id: number;
  createdAt: Date;
  workoutId: number;
  date: Date;
}

export interface RegisterWorkoutActionResult {
  success: boolean;
  message: string;
  data?: WorkoutViewModel;
  errors?: Partial<Record<keyof UpdateWorkoutDto, string[] | undefined>>;
}

export interface UpdateWorkoutActionResult {
  success: boolean;
  data?: WorkoutViewModel;
  message: string;
  errors?: Partial<Record<keyof UpdateWorkoutDto, string[] | undefined>>;
}

export interface DeleteWorkoutActionResult {
  success: boolean;
  message: string;
}
