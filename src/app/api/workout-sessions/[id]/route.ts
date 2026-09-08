import { NextResponse } from 'next/server';

import { WorkoutSessionService } from '@/services-server/workout-session-service';
import type { ErrorResponse } from '@/types/api-types';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

const workoutSessionService = new WorkoutSessionService();
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const sessionId = Number(id);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid workout session id',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const result = await workoutSessionService.finish(sessionId);

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
