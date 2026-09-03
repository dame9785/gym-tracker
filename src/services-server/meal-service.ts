import { MealRepository } from '@/repositories/meal-repository';
import { FoodRepository } from '@/repositories/food-repository';
import { AddMealDto, addMealSchema } from '@/schemas/meal-schemas';
import { MealType } from '@prisma/client';
import { ApiResponse, ErrorResponse, SuccessResponse } from '@/types/api-types';
import { DeleteMealItemResponse, MealViewModel, TodayMealsResponse } from '@/types/meal-types';
import MealMapper from '@/mapping/meals-mapping';
import { GoalTypesService } from '@/services-server/goal-service';
import { errorResponse } from '@/utils/api-error';
import { calculateTotalNutrition } from '@/helpers/calculate-total-nuitration';
import { getGoalCalories } from '@/helpers/get-goal-calories';
import { UserRepository } from '@/repositories/user-repository';
import { calculateNutrition } from '@/helpers/nutrition-calculator';
import { calculateAge } from '@/helpers/calculate-age';
import { calculateCalorieStats } from '@/helpers/nutrition-calculator';

const mealRepository = new MealRepository();
const foodRepository = new FoodRepository();
const goalService = new GoalTypesService();
const userRepository = new UserRepository();

export class MealService {
  async addFoodToMeal(dto: AddMealDto, userId: number) {
    const validation = addMealSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      console.log('1. DTO:', dto);
      console.log('2. UserId:', userId);

      const food = await foodRepository.getById(dto.foodId, userId);

      console.log('3. Food:', food);

      if (!food) {
        return errorResponse('Could not find food.');
      }

      const multiplier = dto.grams / 100;

      const calories = food.caloriesPer100g * multiplier;
      const protein = food.proteinPer100g * multiplier;
      const carbs = food.carbsPer100g * multiplier;
      const fat = food.fatPer100g * multiplier;

      console.log('4. Nutrition:', {
        calories,
        protein,
        carbs,
        fat,
      });

      const existingMeal = await mealRepository.findTodayMealByType(userId, dto.mealType as MealType);

      console.log('5. Existing meal:', existingMeal);

      let mealId: number;

      if (existingMeal) {
        mealId = existingMeal.id;
      } else {
        console.log('6. Creating meal...');

        const newMeal = await mealRepository.createMeal(userId, dto.mealType as MealType);

        console.log('7. New meal:', newMeal);

        mealId = newMeal.id;
      }

      console.log('8. Adding food item...', {
        mealId,
        foodId: food.id,
        grams: dto.grams,
        calories,
        protein,
        carbs,
        fat,
      });

      await mealRepository.addItem({
        mealId,
        foodId: food.id,
        grams: dto.grams,
        calories,
        protein,
        carbs,
        fat,
      });

      console.log('9. Food item added');

      const meal = await mealRepository.getById(mealId, userId);

      console.log('10. Meal:', meal);

      if (!meal) {
        return errorResponse('Meal could not be found.');
      }

      return {
        success: true,
        message: 'Food added successfully.',
        data: MealMapper.toViewModel(meal),
      } satisfies SuccessResponse<MealViewModel>;
    } catch (error) {
      console.error('Create meal failed, server error:', error);

      if (error instanceof Error) {
        console.error('MESSAGE:', error.message);
        console.error('STACK:', error.stack);
      }

      return errorResponse('An error occurred on the server.');
    }
  }

  async getMealsByDate(formattedDate: string, userId: number): Promise<ApiResponse<TodayMealsResponse>> {
    try {
      const meals = await mealRepository.getMealsByDate(userId, formattedDate);

      const user = await userRepository.findById(userId);
      console.log('USER', user);
      console.log('MEAL', meals);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        } satisfies ErrorResponse;
      }

      const calorieStats = calculateCalorieStats({
        weight: Number(user.bodyWeight),
        height: Number(user.height),
        age: calculateAge(user.birthDate),
        gender: user.gender,
      });

      const calories = getGoalCalories(user.goalType, calorieStats);

      const recommendedIntake = calculateNutrition({
        weight: Number(user.bodyWeight),
        calories,
        goal: user.goalType,
      });

      return {
        success: true,
        data: {
          totals: calculateTotalNutrition(meals),
          dailyIntakeGoals: recommendedIntake,
          meals: meals.map((meal) => MealMapper.toViewModel(meal)),
        },
      } satisfies SuccessResponse<TodayMealsResponse>;
    } catch (error) {
      console.error('Update exercise failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getTodayMeals(userId: number): Promise<ApiResponse<TodayMealsResponse>> {
    try {
      const meals = await mealRepository.getTodayMeals(userId);

      const user = await userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        } satisfies ErrorResponse;
      }

      // Beräkna kalorier
      const calorieStats = calculateCalorieStats({
        weight: Number(user.bodyWeight),
        height: Number(user.height),
        age: calculateAge(user.birthDate),
        gender: user.gender,
      });

      // Välj kalorimål baserat på goal type
      const calories = getGoalCalories(user.goalType, calorieStats);

      // Beräkna protein, fett och kolhydrater
      const recommendedIntake = calculateNutrition({
        weight: Number(user.bodyWeight),
        calories,
        goal: user.goalType,
      });

      return {
        success: true,
        data: {
          totals: calculateTotalNutrition(meals),
          dailyIntakeGoals: recommendedIntake,
          meals: meals.map((meal) => MealMapper.toViewModel(meal)),
        },
      } satisfies SuccessResponse<TodayMealsResponse>;
    } catch (error) {
      console.error('Update exercise failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async deleteMealItem(mealItemId: number): Promise<ApiResponse<DeleteMealItemResponse>> {
    try {
      await mealRepository.deleteMealItem(mealItemId);
      return {
        success: true,
        message: 'Meal item deleted successfully.',
      } satisfies SuccessResponse<DeleteMealItemResponse>;
    } catch (error) {
      console.error('Update exercise failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
