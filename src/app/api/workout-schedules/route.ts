import { NextRequest, NextResponse } from 'next/server';

import { WorkoutScheduleService } from '@/services-server/workout-schedule-service';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import type { ErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/user-by-token';

const workoutScheduleService = new WorkoutScheduleService();

export async function GET(request: NextRequest) {
  try {
    const currentUserId = await getCurrentUser();

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized.',
        } satisfies ErrorResponse,
        { status: 401 },
      );
    }

    const { searchParams } = request.nextUrl;
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(currentUserId.userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid parameters.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          message: 'Month must be between 1 and 12.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const workoutSchedules = await workoutScheduleService.getByMonth(currentUserId.userId, year, month);

    return NextResponse.json(
      {
        success: true,
        workoutSchedules,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('GET /api/workout-schedules error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}

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

    const payload = await getUserFromToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized.',
        } satisfies ErrorResponse,
        { status: 401 },
      );
    }

    const userId = payload.userId;
    const dto: unknown = await request.json();

    const workoutSchedule = await workoutScheduleService.create(dto as Parameters<typeof workoutScheduleService.create>[0], userId);

    return NextResponse.json(
      {
        success: true,
        workoutSchedule,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('POST /api/workout-schedules error:', error);

    if (error instanceof Error && error.message.startsWith('Validation failed:')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid workout schedule data.',
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred.',
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
