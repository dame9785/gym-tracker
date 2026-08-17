//Next Response & Request
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutService } from '@/services-server/workout-service';
import { ApiErrorResponse } from '@/types/api-types';

const workoutService = new WorkoutService();

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();
    const result = await workoutService.create(dto);

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

export async function GET() {
  try {
    const result = await workoutService.getAll();

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
