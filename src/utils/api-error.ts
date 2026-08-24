import { ApiErrorResponse } from '@/types/api-types';
import { NextResponse } from 'next/server';

export const errorResponse = (message: string, errors?: Record<string, string[]>): ApiErrorResponse => ({
  success: false,
  message,
  errors,
});

// utils/api-response.ts
export const apiErrorResponse = (message: string, status: number = 500): NextResponse<ApiErrorResponse> => {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
};

export const apiResponse = <T>(data: T, status: number = 200): NextResponse => {
  return NextResponse.json(data, { status: status });
};

export const unauthorizedResponse = (): NextResponse<ApiErrorResponse> => {
  return apiErrorResponse('Unauthorized', 401);
};
