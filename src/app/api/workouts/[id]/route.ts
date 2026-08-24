//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutService } from '@/services-server/workout-service';

//Types
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils/api-error';
import { getCurrentUser } from '@/utils/user-by-token';

const workoutService = new WorkoutService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const result = await workoutService.getById(Number(id), user.userId);

    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/workouts error:', error);
    return apiErrorResponse('An error occurred while fetch workouts.');
  }
}

//PUT: Workout
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const dto: UpdateWorkoutDto = await request.json();

    const result = await workoutService.update(Number(id), dto, user.userId);
    return apiResponse(result);
  } catch (error) {
    console.error('PUT /api/workouts error:', error);
    return apiErrorResponse('An error occurred while update workout.');
  }
}

//DELETE
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const result = await workoutService.delete(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('DELETE /api/workouts/id error:', error);
    return apiErrorResponse('An error occurred while delete workout.');
  }
}
