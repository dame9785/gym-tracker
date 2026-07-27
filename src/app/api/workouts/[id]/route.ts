import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/services-server/workout-service';
import { EditWorkoutDto } from '@/dto/edit-workout-dto';
import { EditWorkoutResponse } from '@/services/workout-service';

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

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
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

//PUT: Workout
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: EditWorkoutDto = await request.json();

    const result = await workoutService.update(Number(id), body);

    if (!result.success) {
      return NextResponse.json({ result }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
        workout: [],
      },
      { status: 500 },
    );
  }
}

//DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await workoutService.delete(Number(id));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      { status: 500 },
    );
  }
}
