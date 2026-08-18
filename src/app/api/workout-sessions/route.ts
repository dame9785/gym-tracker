//Next Response & Request
import { NextResponse, NextRequest } from 'next/server';

//Services
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/api-types';

const workoutSessionService = new WorkoutSessionService();

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromCookieStore();
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
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
    const result = await workoutSessionService.create(userId, dto.workoutId);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      { status: 500 },
    );
  }
}
