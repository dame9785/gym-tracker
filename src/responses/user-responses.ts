export interface RegisterUserResponse {
  success: boolean;
  message: string;
  errors: string[];
  userToken?: string;
}

export interface LoginUserResponse {
  success: boolean;
  message: string;
  errors: string[];
  userToken?: string;
}
