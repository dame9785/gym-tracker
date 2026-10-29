//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import type { WorkoutSessionExerciseViewModel, WorkoutExerciseViewModel } from '@/types/exercise-types';

//Prisma
import { $Enums, WorkoutSessionStatus } from '@prisma/client';

export interface WorkoutViewModel {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  workoutExercises: WorkoutExercisesViewModel[];
}

interface WorkoutExercisesViewModel {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  seconds: number;
  note: string;
  order: number;
}

export interface RegisterWorkoutScheduleDto {
  workoutId: number;
  date: string;
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
  actualSeconds: number | null;
  targetSeconds: number | null;
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

export interface WorkoutSessionFinishViewModel {
  id: number;
  userId: number;
  workoutId: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: $Enums.WorkoutSessionStatus;
}

export type WorkoutActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: Partial<Record<keyof UpdateWorkoutDto, string[]>>;
    };

export type RegisterWorkoutActionResult = WorkoutActionResult<WorkoutViewModel>;

export type UpdateWorkoutActionResult = WorkoutActionResult<WorkoutViewModel>;

export type DeleteWorkoutActionResult = {
  success: boolean;
  message: string;
};
