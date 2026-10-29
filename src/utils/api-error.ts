import type { ErrorResponse } from '@/types/api-types';

export const errorResponse = (message: string, errors?: Record<string, string[]>): ErrorResponse => ({
  success: false,
  message,
  errors,
});
