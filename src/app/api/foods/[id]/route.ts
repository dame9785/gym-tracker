//Next Response & Next Request
import { FoodService } from '@/services-server/food-service';
import { apiErrorResponse, apiResponse } from '@/utils/api-error';
import { NextRequest } from 'next/server';

//Services
const foodService = new FoodService();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await foodService.delete(Number(id));
    console.log(result);
    return apiResponse(result);
  } catch (error) {
    console.error('DELETE /api/foods/ID error:', error);
    return apiErrorResponse('An error occurred while creating food.');
  }
}
