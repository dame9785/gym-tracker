import FoodMapper from '@/mapping/food-mapping';
import { FoodRepository } from '@/repositories/food-repository';
import { ApiErrorResponse, ApiResponse } from '@/types/api-types';
import { FoodApiResponse } from '@/types/food-type';
import { errorResponse } from '@/utils/api-error';

const foodRepository = new FoodRepository();

export class FoodService {
  async getAll(): Promise<ApiResponse<FoodApiResponse>> {
    try {
      const foods = await foodRepository.getAll();
      console.log(foods);

      if (!foods) {
        return {
          success: false,
          message: 'Failed to fetch foods',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: {
          foods: foods.map((food) => FoodMapper.foodModelToViewModel(food)),
        },
      };
    } catch (error) {
      console.error('Foods failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async search(searchTerm: string) {
    if (!searchTerm.trim()) {
      return [];
    }

    return foodRepository.search(searchTerm);
  }

  async getById(id: number) {
    return foodRepository.getById(id);
  }

  async create(data: { name: string; caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number }) {
    return foodRepository.create(data);
  }
}
