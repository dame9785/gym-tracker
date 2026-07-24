import { NextResponse, NextRequest } from 'next/server';
import { WorkoutSessionService } from '@/services-server/workout-session-service';

const workoutSessionService = new WorkoutSessionService();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await workoutSessionService.getById(Number(id));

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const result = await workoutSessionService.finish(Number(id));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
