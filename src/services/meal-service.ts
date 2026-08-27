import { ApiResponse } from '@/types/api-types';
import { TodayMealApiResponse } from '@/types/food-type';
import { errorResponse } from '@/utils/api-error';

const API_URL = 'http://localhost:3000/api/meals';

export default class MealService {
  static async getMeals(userToken: string): Promise<ApiResponse<TodayMealApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });
      return (await response.json()) as ApiResponse<TodayMealApiResponse>;
    } catch (error) {
      return errorResponse('Kunde inte ansluta till servern');
    }
  }
}
