import { NextResponse, type NextRequest } from 'next/server';

import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import type { ErrorResponse } from '@/types/api-types';

const workoutSessionService = new WorkoutSessionService();

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromCookieStore();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized.',
        } satisfies ErrorResponse,
        { status: 401 },
      );
    }

    const payload = getUserFromToken(token);

    if (!payload || !Number.isSafeInteger(payload.userId) || payload.userId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized.',
        } satisfies ErrorResponse,
        { status: 401 },
      );
    }

    let dto: unknown;

    try {
      dto = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON body.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    if (
      typeof dto !== 'object' ||
      dto === null ||
      !('workoutId' in dto) ||
      typeof dto.workoutId !== 'number' ||
      !Number.isSafeInteger(dto.workoutId) ||
      dto.workoutId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid workout ID.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const result = await workoutSessionService.create(dto.workoutId, payload.userId);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error('Failed to create workout session:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
