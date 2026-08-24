//Next Response
import { NextResponse } from 'next/server';

//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Types
import { RegisterExerciseDto } from '@/types/exercise-types';
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils/api-error';
import { getCurrentUser } from '@/utils/user-by-token';

const exerciseService = new ExerciseService();

export async function GET() {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const result = await exerciseService.getAllExersise(user.userId);
    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/exercise error:', error);
    return apiErrorResponse('An error occurred while fetching exericse.');
  }
}

export async function POST(request: Request) {
  const dto: RegisterExerciseDto = await request.json();
  try {
    const result = await exerciseService.registerExercise(dto);
    return apiResponse(result, 201);
  } catch (error) {
    console.error('POST /api/exercise error:', error);
    return apiErrorResponse('An error occurred while creating exericse.');
  }
}
