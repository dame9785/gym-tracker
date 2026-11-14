import { FoodViewModel } from '@/types/foods-type';
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
}
