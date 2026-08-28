import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { MealType, TodayMealsApiResponse } from '@/types/meal-types';

const API_URL = 'http://localhost:3000/api/meals';

interface AddMealDto {
  foodId: number;
  mealType: MealType;
  grams: number;
}

export default class MealService {
  async getTodayMeals(userToken: string): Promise<ApiResponse<TodayMealsApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiSuccessResponse<TodayMealsApiResponse>;
      return result;
    } catch (error) {
      console.error('Failed to fetch today meals:', error);

      return {
        success: false,
        message: 'Failed to fetch today meals.',
      };
    }
  }

  async addMeal(formData: AddMealDto): Promise<ApiResponse<unknown>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as ApiSuccessResponse<unknown>;

      return result;
    } catch (error) {
      console.error('Failed to add meal:', error);

      return {
        success: false,
        message: 'Could not add meal.',
      };
    }
  }
}
