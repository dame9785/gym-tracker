import type { LogItemViewModel } from './log-weight-types';
import type { ExerciseViewModel } from './exercise-types';
import type { WeeklyWorkoutViewModel, WorkoutSessionFinishViewModel, WorkoutSessionViewModel, WorkoutViewModel } from './workout-types';
import type { WeeklySummaryViewModel } from './dashboard-types';
import type { HistoryViewModel } from './history-types';

// --------------------------------------------------
// Generic API responses
// --------------------------------------------------

export type SuccessResponse<T = undefined> = [T] extends [undefined]
  ? {
      success: true;
      message?: string;
      data?: undefined;
    }
  : [T] extends [void]
    ? {
        success: true;
        message?: string;
        data?: T;
      }
    : {
        success: true;
        message?: string;
        data: T;
      };

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// --------------------------------------------------
// Authentication
// --------------------------------------------------

// --------------------------------------------------
// Weight logs
// --------------------------------------------------

export type LogWeightResponse = LogItemViewModel;

export type EditLogWeightResponse = LogItemViewModel;

export interface UserLogWeightResponse {
  logList: LogItemViewModel[];
  currentWeight: number | null;
  startWeight: number | null;
  pagination: PaginationViewModel;
}

export type DeleteLogWeightResponse = [];

// --------------------------------------------------
// Exercises
// --------------------------------------------------

// --------------------------------------------------
// Workouts
// --------------------------------------------------

export interface WorkoutApiResponse {
  workouts: WorkoutViewModel[];
  pagination: PaginationViewModel;
}

export interface WorkoutApiGetByIdResponse {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
}

// --------------------------------------------------
// Dashboard
// --------------------------------------------------

export interface DashboardResult {
  weeklyOverview: WeeklyWorkoutViewModel[];
  todayWorkout?: WeeklyWorkoutViewModel;
  weeklySummary: WeeklySummaryViewModel;
}

// --------------------------------------------------
// History
// --------------------------------------------------

export interface HistoryApiResponse {
  history: HistoryViewModel;
  pagination: PaginationViewModel;
}

// --------------------------------------------------
// Pagination
// --------------------------------------------------

export interface PaginationViewModel {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

// --------------------------------------------------
// Workout sessions
// --------------------------------------------------

export type WorkoutFinishApiResponse = WorkoutSessionFinishViewModel;

export type WorkoutSessionCreateResponse = number;

export type WorkoutSessionUpdatedSetResponse = UpdatedSetViewModel;

export type WorkoutSessionDetailApiResponse = WorkoutSessionViewModel;

export interface UpdateWorkoutSessionResponse {
  message: string;
  success: boolean;
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
