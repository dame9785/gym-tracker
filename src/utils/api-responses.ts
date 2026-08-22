import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api-types';

export const errorResponse = (message: string): ApiErrorResponse => ({
  success: false,
  message,
});
