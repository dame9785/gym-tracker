//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutService } from '@/services-server/workout-service';

//Types
import { ApiErrorResponse } from '@/types/api-types';
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';

const workoutService = new WorkoutService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await workoutService.getById(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

//PUT: Workout
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dto: UpdateWorkoutDto = await request.json();

    const result = await workoutService.update(Number(id), dto);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

//DELETE
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await workoutService.delete(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
