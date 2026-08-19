//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { ApiErrorResponse } from '@/types/api-types';

const workoutSessionService = new WorkoutSessionService();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const dto = await request.json();

    const result = await workoutSessionService.updateSet(Number(id), dto.actualReps, dto.actualWeight);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
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
