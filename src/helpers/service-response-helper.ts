import type { ServiceResponse } from '@/types/service-types';

export function errorResponse<T>(message: string, errors?: Record<string, string[]>): ServiceResponse<T> {
  return {
    success: false,
    message,
    errors,
  };
}
