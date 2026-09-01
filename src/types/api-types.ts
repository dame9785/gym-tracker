import { GoalTypeViewModel } from './goal-types';
import { UserViewModel } from './user-types';
import { LogItemViewModel } from './log-weight-types';
import { ExerciseViewModel } from './exercise-types';
import {
  WeeklyWorkoutViewModel,
  WorkoutSchedelueViewModel,
  WorkoutSessionFinishViewModel,
  WorkoutSessionViewModel,
  WorkoutViewModel,
} from './workout-types';
import { WeeklySummaryViewModel } from './dashboard-types';
import { HistoryViewModel } from './history-types';

export type SuccessResponse<T = undefined> = {
  success: true;
  message?: string;
  data?: T;
};

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Login
export interface LoginResponse {
  userId: number;
  token: string;
}

export type UserResponse = UserViewModel;

export type LogWeightResponse = LogItemViewModel;

export type EditLogWeightResponse = LogItemViewModel;

export type UpdateUserResponse = UserViewModel;

// Register
export interface RegisterResponse {
  userId: number;
  token: string;
}

//Login
export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface UserLogWeightResponse {
  logList: LogItemViewModel[];
  currentWeight: number | null;
  startWeight: number | null;
  pagination: PaginationViewModel;
}

export type DeleteLogWeightResponse = [];

export type FoodDeleteResponse = [];

export type ExerciseApiResponse = ExerciseViewModel[];

export interface ExerciseApiDeleteResponse {
  success: true;
  message: string;
}

export type ExerciseApiRegisterResponse = ExerciseViewModel;

export type ExerciseApiGetByIdResponse = ExerciseViewModel;

export type ExerciseApiUpdateResponse = void;

export interface WorkoutApiResponse {
  workouts: WorkoutViewModel[];
  pagination: PaginationViewModel;
}

export interface WorkoutApiDeleteResponse {
  success: true;
  message: string;
}

export interface WorkoutApiGetByIdResponse {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
}

export type WorkoutApiUpdateResponse = WorkoutViewModel;

export type WorkoutApiRegisterResponse = WorkoutViewModel;

export interface DashboardApiResponse {
  weeklyOverview: WeeklyWorkoutViewModel[];
  todayWorkout?: WeeklyWorkoutViewModel;
  weeklySummary: WeeklySummaryViewModel;
}

export interface HistoryApiResponse {
  history: HistoryViewModel;
  pagination: PaginationViewModel;
}

export interface PaginationViewModel {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export type WorkoutFinishApiResponse = WorkoutSessionFinishViewModel;

export type WorkoutSessionCreateResponse = number;

export type WorkoutSessionUpdatedSetResponse = UpdatedSetViewModel;

export type WorkoutSessionDetailApiResponse = WorkoutSessionViewModel;

export type WorkoutSchedelueCreateResponse = WorkoutSchedelueViewModel;

export interface UpdateWorkoutSessionResponse {
  message: string;
  success: boolean;
}

export interface UpdatedSetViewModel {
  id: number;
  actualReps: number | null;
  actualWeight: number | null;
  setNumber: number;
  workoutSessionExerciseId: number;
  targetReps: number;
  targetWeight: number | null;
  completed: boolean;
  completedAt: Date | null;
}
