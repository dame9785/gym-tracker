import type { MealViewModel } from '@/mapping/meal-mapping';

type NutritionItem = Pick<MealViewModel['items'][number], 'caloriesSnapshot' | 'proteinSnapshot' | 'carbsSnapshot' | 'fatSnapshot'>;

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function calculateMealNutrition(items: readonly NutritionItem[]): NutritionTotals {
  return items.reduce(
    (total, item) => ({
      calories: total.calories + item.caloriesSnapshot,
      protein: total.protein + item.proteinSnapshot,
      carbs: total.carbs + item.carbsSnapshot,
      fat: total.fat + item.fatSnapshot,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );
}
