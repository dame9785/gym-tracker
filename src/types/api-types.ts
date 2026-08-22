import { GoalTypeViewModel } from './goal-types';
import { UserViewModel } from './user-types';
import { LogItemViewModel } from './log-weight-types';
import { ExerciseViewModel } from './exercise-types';
import { WeeklyWorkoutViewModel, WorkoutSchedelueViewModel, WorkoutSessionFinishViewModel, WorkoutSessionViewModel, WorkoutViewModel } from './workout-types';
import { WeeklySummaryViewModel } from './dashboard-types';
import { HistoryViewModel } from './history-types';
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Login
export interface LoginResponse {
  userId: number;
  token: string;
}

export type UserResponse = UserViewModel;

export type LogWeightResponse = LogItemViewModel;

export type EditLogWeightResponse = LogItemViewModel;

export type UpdateUserResponse = UserViewModel;

//Goal Type
export type GoalResponse = GoalTypeViewModel[];

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
  currentWeight: string | undefined;
  startWeight: string | undefined;
  pagination: PaginationViewModel;
}

export interface DeleteLogWeightResponse {
  data?: [];
}

export interface ExerciseApiResponse {
  exercises: ExerciseViewModel[];
}

export interface ExerciseApiDeleteResponse {
  success: true;
  message: string;
}

export interface ExerciseApiRegisterResponse {
  exercise: ExerciseViewModel;
}

export interface ExerciseApiGetByIdResponse {
  exercise: ExerciseViewModel;
}

export interface ExerciseApiUpdateResponse {
  exercise: ExerciseViewModel;
}

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

export interface WorkoutApiUpdateResponse {
  workout: WorkoutViewModel;
}

export interface WorkoutApiRegisterResponse {
  workout: WorkoutViewModel;
}

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

export interface WorkoutFinishApiResponse {
  workoutSession: WorkoutSessionFinishViewModel;
}

export interface WorkoutSessionCreateResponse {
  workoutSessionId: number;
}

export interface WorkoutSessionUpdatedSetResponse {
  updatedSet: UpdatedSetViewModel;
}

export interface WorkoutSessionDetailApiResponse {
  workoutSession: WorkoutSessionViewModel;
}

export interface WorkoutSchedelueCreateResponse {
  workoutSchedule: WorkoutSchedelueViewModel;
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
