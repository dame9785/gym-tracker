import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { MealType, TodayMealsApiResponse } from '@/types/meal-types';
import { errorResponse } from '@/utils/api-error';

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

  // HÄMTA MEALS FÖR ETT SPECIFIKT DATUM
  async getMealsByDate(userToken: string, date: string): Promise<ApiResponse<TodayMealsApiResponse>> {
    try {
      const response = await fetch(`${API_URL}?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiSuccessResponse<TodayMealsApiResponse>;

      return result;
    } catch (error) {
      console.error('Failed to fetch meals by date:', error);

      return {
        success: false,
        message: 'Failed to fetch meals for selected date.',
      };
    }
  }

  async addMeal(formData: AddMealDto, userToken: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as ApiSuccessResponse<unknown>;

      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }
}
