export interface UserValidationResponse {
  success: boolean;
  message: string;
  errors: string[];
  userId?: number;
  userToken?: string;
}
