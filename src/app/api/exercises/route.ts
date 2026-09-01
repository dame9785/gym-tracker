//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Types
import { RegisterExerciseDto } from '@/types/exercise-types';
import { apiErrorResponse, apiResponse } from '@/utils/api-error';

const exerciseService = new ExerciseService();

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
