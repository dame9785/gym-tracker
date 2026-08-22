//Next Response & Request
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutService } from '@/services-server/workout-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/auth';

const workoutService = new WorkoutService();

export async function POST(request: NextRequest) {
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

    const dto = await request.json();
    const result = await workoutService.create(dto, currentUserId.userId);

    return NextResponse.json(result, { status: result.success ? 202 : 404 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

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

    const result = await workoutService.getAll(currentUserId.userId, page);

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error(error);

    return (
      NextResponse.json({
        success: false,
        message: 'Server fel, gick inte hämta data',
      } satisfies ApiErrorResponse),
      { status: 500 }
    );
  }
}
