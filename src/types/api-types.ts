import { GoalTypeViewModel } from './goal-types';
import { UserViewModel } from './user-types';

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

//Login
export interface LogoutResponse {
  success: boolean;
  message: string;
}

//Goal Type
export interface GoalResponse {
  goals: GoalTypeViewModel[];
}
