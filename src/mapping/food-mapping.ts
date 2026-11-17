import { CustomFood, CustomFoodViewModel, FoodViewModel } from '@/types/foods-type';
import { Prisma } from '@prisma/client';

export class FoodMappper {
  static mapFood(food: { calories: Prisma.Decimal; protein: Prisma.Decimal; carbs: Prisma.Decimal; fat: Prisma.Decimal; [key: string]: unknown }): FoodViewModel {
    return {
      ...food,
      calories: Number(food.calories),
      protein: Number(food.protein),
      carbs: Number(food.carbs),
      fat: Number(food.fat),
    } as FoodViewModel;
  }
  static mapCustomFood(customFood: CustomFood): CustomFoodViewModel {
    return {
      ...customFood,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein),
      carbs: Number(customFood.carbs),
      fat: Number(customFood.fat),
    };
  }
}
