import { ApiResponse } from '@/types/api-types';
import { FoodApiResponse } from '@/types/food-type';
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/foods';

interface FoodDto {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export default class FoodService {
  static async getAllFoods(): Promise<ApiResponse<FoodApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      return (await response.json()) as ApiResponse<FoodApiResponse>;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }

  static async create(dto: FoodDto): Promise<ApiResponse<FoodApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body: JSON.stringify(dto),
      });

      return (await response.json()) as ApiResponse<FoodApiResponse>;
    } catch (error) {
      return errorResponse('Could not connect to the server.');
    }
  }
}
