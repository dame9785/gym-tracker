import { FoodViewModel } from '@/types/food-type';
import { Food } from '@prisma/client';

export default class FoodMapper {
  static foodModelToViewModel(food: Food): FoodViewModel {
    return {
      id: food.id,
      name: food.name,
      createdAt: food.createdAt,
      updatedAt: food.updatedAt,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
    };
  }
}
