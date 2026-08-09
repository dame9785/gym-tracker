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

// Register
export interface RegisterResponse {
  userId: number;
  token: string;
}
