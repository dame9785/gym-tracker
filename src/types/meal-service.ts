import { date, success } from 'zod';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from './api-types';
import { MealsApiResponse } from './meal-types';
import { MealRepository } from '@/repositories/meal-repository';
import MealMapper from '@/mapping/meals-mapping';

const mealRepostory = new MealRepository();

export default class MealService {
  async getMeals(userId: number): Promise<ApiResponse<MealsApiResponse>> {
    try {
      const meals = await mealRepostory.getMeals(userId);

      const viewModel = meals.map((item) => MealMapper.mapMealDboToViewModel(item));

      return {
        success: true,
        data: {
          meals: viewModel,
        },
      } satisfies ApiSuccessResponse<MealsApiResponse>;
    } catch (error) {
      console.error('GET MEAL:', error);

      return {
        success: false,
        message: 'Server error',
      } satisfies ApiErrorResponse;
    }
  }
}
