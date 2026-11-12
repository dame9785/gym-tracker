import type { WorkoutSessionStatus } from '@prisma/client';

import type { ExerciseViewModel, WorkoutSessionExerciseViewModel, WorkoutExerciseViewModel } from '@/types/exercise-types';

import type { PaginationViewModel } from '@/types/pagination-types';

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

export interface WeeklyWorkoutViewModel {
  id: number;
  workoutId: number;
  workoutName: string;
  date: string;
  exerciseCount: number;
  estimatedMinutes: number;
  status: WorkoutSessionStatus | null;
  activeSessionId: number | null;
  exercises: WorkoutExerciseViewModel[];
}

export interface WorkoutSessionFinishViewModel {
  id: number;
  userId: number;
  workoutId: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: WorkoutSessionStatus;
}

export interface WorkoutDetailsResult {
  workout: WorkoutViewModel;
  exercises: ExerciseViewModel[];
}

export interface WorkoutListResult {
  workouts: WorkoutViewModel[];
  pagination: PaginationViewModel;
}

export interface UpdatedSetViewModel {
  id: number;
  actualReps: number | null;
  actualWeight: number | null;
  actualSeconds: number | null;
  setNumber: number;
  workoutSessionExerciseId: number;
  targetReps: number;
  targetWeight: number | null;
  targetSeconds: number | null;
  completed: boolean;
  completedAt: Date | null;
}
