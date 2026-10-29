import { NextResponse, type NextRequest } from 'next/server';

import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import type { ErrorResponse } from '@/types/api-types';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const workoutSessionService = new WorkoutSessionService();

export async function PUT(_request: NextRequest, { params }: RouteContext) {
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

    const { id } = await params;
    const sessionId = Number(id);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid workout session id.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const result = await workoutSessionService.finish(sessionId, payload.userId);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('PUT /api/workout-sessions/[id] error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
