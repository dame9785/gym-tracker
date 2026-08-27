import type { Food, NutritionTotals } from '@/types/food-type';

export function calculateFoodNutrition(food: Food, grams: number): NutritionTotals {
  const multiplier = grams / 100;

  return {
    calories: Math.round(food.caloriesPer100g * multiplier),
    protein: Math.round(food.proteinPer100g * multiplier),
    carbs: Math.round(food.carbsPer100g * multiplier),
    fat: Math.round(food.fatPer100g * multiplier),
  };
}
