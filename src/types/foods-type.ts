import type { Prisma } from '@prisma/client';

export type FoodViewModel = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  [key: string]: unknown;
};

export type CustomFood = Prisma.CustomFoodGetPayload<Record<string, never>>;

export type CustomFoodViewModel = Omit<CustomFood, 'calories' | 'protein' | 'carbs' | 'fat'> & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type ProductActionResult = Awaited<ReturnType<typeof import('@/actions/product-actions').getProductsAction>>;

export type ProductViewModel = Extract<ProductActionResult, { success: true }>['data'][number];

export type SelectedFood = { source: 'PRODUCT'; food: ProductViewModel } | { source: 'CUSTOM'; food: CustomFoodViewModel };
