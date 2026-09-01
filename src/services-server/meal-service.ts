import { MealRepository } from '@/repositories/meal-repository';
import { FoodRepository } from '@/repositories/food-repository';
import { AddMealDto, AddMealItemDto, addMealSchema } from '@/schemas/meal-schemas';
import { MealType } from '@prisma/client';
import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { MealViewModel, TodayMealsApiResponse } from '@/types/meal-types';
import MealMapper from '@/mapping/meals-mapping';
import GoalService from '@/services-server/goal-service';
import { errorResponse } from '@/utils/api-error';

const mealRepository = new MealRepository();
const foodRepository = new FoodRepository();
const goalService = new GoalService();

export class MealService {
  async addFoodToMeal(dto: AddMealDto, userId: number) {
    const validation = addMealSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      // 1. Hämta maten från databasen
      const food = await foodRepository.getById(dto.foodId, userId);

      if (!food) {
        return errorResponse('Could find food.');
      }

      // 2. Beräkna näringsvärden baserat på antal gram
      const multiplier = dto.grams / 100;

      const calories = food.caloriesPer100g * multiplier;

      const protein = food.proteinPer100g * multiplier;

      const carbs = food.carbsPer100g * multiplier;

      const fat = food.fatPer100g * multiplier;

      // 3. Leta efter dagens måltid
      const existingMeal = await mealRepository.findTodayMealByType(userId, dto.mealType as MealType);

      let mealId: number;

      // 4. Använd befintlig måltid eller skapa en ny
      if (existingMeal) {
        mealId = existingMeal.id;
      } else {
        const newMeal = await mealRepository.createMeal(userId, dto.mealType as MealType);

        mealId = newMeal.id;
      }

      // 5. Lägg till maten i måltiden
      const mealItem = await mealRepository.addItem({
        mealId,
        foodId: food.id,
        grams: dto.grams,
        calories,
        protein,
        carbs,
        fat,
      });
      return {
        success: true,
        message: 'Food fetched successfully.',
        data: mealItem,
      } satisfies ApiSuccessResponse<MealViewModel>;
    } catch (error) {
      console.error('Create meal failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getMealsByDate(formattedDate: string, userId: number): Promise<ApiResponse<TodayMealsApiResponse>> {
    const meals = await mealRepository.getMealsByDate(userId, formattedDate);

    const goal = await goalService.getUserGoal(userId);

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    for (const meal of meals) {
      for (const item of meal.items) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      }
    }

    return {
      success: true,
      data: {
        totals,
        goal: {
          calories: goal?.calories ?? 0,
          protein: goal?.protein ?? 0,
          carbs: goal?.carbs ?? 0,
          fat: goal?.fat ?? 0,
        },
        meals: meals.map((meal) => MealMapper.toViewModel(meal)),
      },
    } satisfies ApiSuccessResponse<TodayMealsApiResponse>;
  }

  async getTodayMeals(userId: number): Promise<ApiResponse<TodayMealsApiResponse>> {
    const meals = await mealRepository.getTodayMeals(userId);
    const goal = await goalService.getUserGoal(userId);

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    for (const meal of meals) {
      for (const item of meal.items) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      }
    }

    return {
      success: true,
      data: {
        totals: totals,
        goal: {
          calories: goal?.calories ?? 0,
          protein: goal?.protein ?? 0,
          carbs: goal?.carbs ?? 0,
          fat: goal?.fat ?? 0,
        },
        meals: meals.map((item) => MealMapper.toViewModel(item)),
      },
    } satisfies ApiSuccessResponse<TodayMealsApiResponse>;
  }
  async deleteMeal(id: number) {
    try {
      await mealRepository.deleteMeal(id);
      return {
        success: true,
        message: 'Måltid borttagen',
      };
    } catch (error) {
      console.error('Failed to add meal:', error);

      return {
        success: false,
        message: 'Could not add meal.',
      };
    }
  }
}
