import { NextRequest, NextResponse } from 'next/server';

import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import type { ErrorResponse } from '@/types/api-types';

const workoutSessionService = new WorkoutSessionService();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getTokenFromCookieStore();

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' } satisfies ErrorResponse, { status: 401 });
    }

    const payload = getUserFromToken(token);

    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' } satisfies ErrorResponse, { status: 401 });
    }

    const { id } = await params;
    const setId = Number(id);

    if (!Number.isSafeInteger(setId) || setId <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid set id.' } satisfies ErrorResponse, { status: 400 });
    }

    let dto: unknown;

    try {
      dto = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 });
    }

    if (typeof dto !== 'object' || dto === null || !('actualReps' in dto) || !('actualWeight' in dto) || !('actualSeconds' in dto)) {
      return NextResponse.json({ success: false, message: 'Invalid set data.' } satisfies ErrorResponse, { status: 400 });
    }

    const { actualReps, actualWeight, actualSeconds } = dto;

    if (
      typeof actualReps !== 'number' ||
      !Number.isFinite(actualReps) ||
      !Number.isInteger(actualReps) ||
      actualReps < 0 ||
      typeof actualWeight !== 'number' ||
      !Number.isFinite(actualWeight) ||
      actualWeight < 0 ||
      typeof actualSeconds !== 'number' ||
      !Number.isFinite(actualSeconds) ||
      actualSeconds < 0
    ) {
      return NextResponse.json({ success: false, message: 'Invalid set values.' } satisfies ErrorResponse, { status: 400 });
    }

    const result = await workoutSessionService.updateSet(setId, actualReps, actualWeight, actualSeconds, payload.userId);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('PUT /api/workout-session-sets/[id] error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
