import { AddFoodDto } from '@/schemas/food-schemas';
import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { FoodApiResponse, FoodDeleteApiResponse } from '@/types/food-type';
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/foods';

export default class FoodService {
  async getAllFoods(): Promise<ApiResponse<FoodApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      return (await response.json()) as ApiResponse<FoodApiResponse>;
    } catch (error) {
      console.error('Could not connect to server:', error);
      return errorResponse('Could not connect to the server.');
    }
  }

  async create(dto: AddFoodDto): Promise<ApiResponse<FoodApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body: JSON.stringify(dto),
      });

      return (await response.json()) as ApiResponse<FoodApiResponse>;
    } catch (error) {
      console.error('Could not connect to server:', error);
      return errorResponse('Could not connect to the server.');
    }
  }

  async delete(foodId: number): Promise<ApiResponse<FoodDeleteApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${foodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        console.error('Failed to delete food:', {
          status: response.status,
          error: errorData,
        });

        return errorResponse(errorData?.message ?? 'Could not delete food.');
      }

      return (await response.json()) as ApiSuccessResponse<FoodDeleteApiResponse>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }
}
