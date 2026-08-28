import GoalTypesService from '@/services-server/goal-service';
import { apiErrorResponse, apiResponse } from '@/utils/api-error';

const goalTypeService = new GoalTypesService();

// GET all goal types
export async function GET() {
  try {
    const result = await goalTypeService.getAllGoals();
    return apiResponse(result);
  } catch (error) {
    console.error('POST /api/exercise error:', error);
    return apiErrorResponse('An error occurred while fetching exericse.');
  }
}
