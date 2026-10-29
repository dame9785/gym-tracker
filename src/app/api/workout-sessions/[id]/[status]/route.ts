import { NextResponse, type NextRequest } from 'next/server';

import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import type { ErrorResponse } from '@/types/api-types';

const workoutSessionService = new WorkoutSessionService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
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

    if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid workout session ID.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    await workoutSessionService.updateWorkoutSessionStatus(sessionId, payload.userId);

    return NextResponse.json(
      {
        success: true,
        data: {
          success: true,
          message: 'Status updated',
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('PUT /api/workout-sessions/[id]/status error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
