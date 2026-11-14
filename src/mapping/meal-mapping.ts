import { Prisma } from '@prisma/client';

import { FoodMappper } from '@/mapping/food-mapping';
import { FoodViewModel } from '@/types/foods-type';

type MealRecord = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        customFood: true;
      };
    };
  };
}>;

export type MealViewModel = Omit<MealRecord, 'items'> & {
  items: Array<
    Omit<MealRecord['items'][number], 'quantity' | 'caloriesSnapshot' | 'proteinSnapshot' | 'carbsSnapshot' | 'fatSnapshot' | 'product' | 'customFood'> & {
      quantity: number;
      caloriesSnapshot: number;
      proteinSnapshot: number;
      carbsSnapshot: number;
      fatSnapshot: number;
      product: FoodViewModel | null;
      customFood: FoodViewModel | null;
    }
  >;
};

export class MealMapping {
  static mapMeal(meal: MealRecord): MealViewModel {
    return {
      ...meal,
      items: meal.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        caloriesSnapshot: Number(item.caloriesSnapshot),
        proteinSnapshot: Number(item.proteinSnapshot),
        carbsSnapshot: Number(item.carbsSnapshot),
        fatSnapshot: Number(item.fatSnapshot),
        product: item.product ? FoodMappper.mapFood(item.product) : null,
        customFood: item.customFood ? FoodMappper.mapFood(item.customFood) : null,
      })),
    };
  }
}
