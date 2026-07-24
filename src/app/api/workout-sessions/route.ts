import { NextRequest, NextResponse } from 'next/server';
import { WorkoutSessionService } from '@/services-server/workout-session-service';

const workoutSessionService = new WorkoutSessionService();

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();

    const result = await workoutSessionService.create(15, dto.workoutId);

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
