import { GoalTypeViewModel } from './goal-types';
import { UserViewModel } from './user-types';
import { LogItemViewModel } from './log-weight-types';
import { ExerciseViewModel } from './exercise-types';
import { WorkoutViewModel } from './workout-types';
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
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

export interface UserResponse {
  user: UserViewModel;
}

// Register
export interface RegisterResponse {
  userId: number;
  token: string;
}

export interface UpdateUserResponse {
  user: UserViewModel;
}

//Login
export interface LogoutResponse {
  success: boolean;
  message: string;
}

//Goal Type
export interface GoalResponse {
  goals: GoalTypeViewModel[];
}

export interface UserLogWeightResponse {
  logList: LogItemViewModel[];
  currentWeight: string | undefined;
  startWeight: string | undefined;
}

export interface LogWeightResponse {
  log: LogItemViewModel;
}

export interface DeleteLogWeightResponse {
  data?: [];
}

export interface EditLogWeightResponse {
  data: LogItemViewModel;
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
