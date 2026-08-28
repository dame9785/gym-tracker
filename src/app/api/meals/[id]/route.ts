import MealService from '@/services-server/meal-service';
import { apiErrorResponse, apiResponse } from '@/utils/api-error';
import { NextRequest } from 'next/server';

const mealService = new MealService();
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = mealService.deleteMeal(Number(id));

    return apiResponse(result);
  } catch (error) {
    console.error('DELETE /api/meals error:', error);

    return apiErrorResponse('An error occurred while fetching meals.');
  }
}
