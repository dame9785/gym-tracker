import { NextRequest, NextResponse } from 'next/server';
import { WorkoutSessionService } from '@/services-server/workout-session-service';

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

    const result = await workoutSessionService.updateSet(
      Number(id),
      dto.actualReps,
      dto.actualWeight,
    );

    return NextResponse.json(result);
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
