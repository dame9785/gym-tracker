import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/user-by-token';
import { NextResponse } from 'next/server';

const workoutSessionService = new WorkoutSessionService();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const result = await workoutSessionService.updateWorkoutSessionStatus(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 402 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      } satisfies ApiErrorResponse,
      {
        status: 500,
      },
    );
  }
}
