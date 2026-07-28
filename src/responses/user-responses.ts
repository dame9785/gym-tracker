export interface RegisterUserResponse {
  success: boolean;
  message: string;
  errors: string[];
  userToken?: string;
}
