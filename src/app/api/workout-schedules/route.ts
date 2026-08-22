//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutScheduleService } from '@/services-server/workout-schedule-service';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/auth';

const workoutScheduleService = new WorkoutScheduleService();

export async function GET(request: NextRequest) {
  try {
    //Get current User from Cookie store
    const currentUserId = await getCurrentUser();

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
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
          message: 'Ogiltiga parametrar.',
        },
        { status: 400 },
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          message: 'Månaden måste vara mellan 1 och 12.',
        },
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
  } catch (error) {
    console.error('GET /api/workout-schedule ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
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
          message: 'No token found',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }

    const payLoad = await getUserFromToken(token);

    if (!payLoad) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }
    const userId = payLoad.userId;

    const dto = await request.json();
    const result = await workoutScheduleService.create(dto, userId);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
      { status: 500 },
    );
  }
}
