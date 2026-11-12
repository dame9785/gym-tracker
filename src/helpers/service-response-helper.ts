import type { ApiResponse } from '@/types/api-types';

export function errorResponse<T>(message: string, errors?: Record<string, string[]>): ApiResponse<T> {
  return {
    success: false,
    message,
    errors,
  };
}
