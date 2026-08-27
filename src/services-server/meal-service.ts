import { MealRepository } from '@/repositories/meal-repository';

import type { MealsApiResponse } from '@/types/meal-types';

import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import MealMapper from '@/mapping/meals-mapping';

const mealRepository = new MealRepository();

export class MealService {
  // async create(userId: number, data: CreateMealInput) {
  //   const mealItems = [];

  //   for (const item of data.items) {
  //     const food = await foodRepository.getById(item.foodId);

  //     if (!food) {
  //       throw new Error(`Mat med id ${item.foodId} hittades inte`);
  //     }

  //     const multiplier = item.grams / 100;

  //     const calories = Math.round(food.caloriesPer100g * multiplier);
  //     const protein = Math.round(food.proteinPer100g * multiplier);
  //     const carbs = Math.round(food.carbsPer100g * multiplier);
  //     const fat = Math.round(food.fatPer100g * multiplier);

  //     mealItems.push({
  //       foodId: food.id,
  //       grams: item.grams,
  //       calories,
  //       protein,
  //       carbs,
  //       fat,
  //     });
  //   }

  //   // Summera hela måltiden
  //   const totals = mealItems.reduce(
  //     (total, item) => ({
  //       calories: total.calories + item.calories,
  //       protein: total.protein + item.protein,
  //       carbs: total.carbs + item.carbs,
  //       fat: total.fat + item.fat,
  //     }),
  //     {
  //       calories: 0,
  //       protein: 0,
  //       carbs: 0,
  //       fat: 0,
  //     },
  //   );

  //   // Spara själva måltiden + ingredienser
  //   const meal = await mealRepository.create({
  //     userId,
  //     name: data.name,
  //     mealType: data.mealType,
  //     items: mealItems,
  //   });

  //   // Lägg automatiskt till måltiden i dagens intag
  //   await calorieRepository.upsertNutritionLog(userId, totals);

  //   return {
  //     meal,
  //     totals,
  //   };
  // }

  async getMeals(userId: number): Promise<ApiResponse<MealsApiResponse>> {
    const meals = await mealRepository.getMeals(userId);

    const viewModel = meals.map((meal) => MealMapper.mapMealDboToViewModel(meal));

    return {
      success: true,
      data: {
        meals: viewModel,
      },
    } satisfies ApiSuccessResponse<MealsApiResponse>;
  }
}
