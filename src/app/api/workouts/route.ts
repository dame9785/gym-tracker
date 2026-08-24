//Next Response & Request
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutService } from '@/services-server/workout-service';
import { getCurrentUser } from '@/utils/user-by-token';
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils/api-error';

const workoutService = new WorkoutService();

export async function POST(request: NextRequest) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const dto = await request.json();
    const result = await workoutService.create(dto, user.userId);

    return apiResponse(result, 201);
  } catch (error) {
    console.error('POST /api/workout error:', error);
    return apiErrorResponse('An error occurred while creating workout.');
  }
}

export async function GET(request: Request) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const result = await workoutService.getAll(user.userId, page);

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('GET /api/workout/id error:', error);
    return apiErrorResponse('An error occurred while fetch workout.');
  }
}
