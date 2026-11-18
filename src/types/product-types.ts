import type { Prisma } from '@prisma/client';

// --------------------------------------------------
// Product types
// --------------------------------------------------

export type Product = Prisma.ProductGetPayload<Record<string, never>>;

export type ProductViewModel = Omit<Product, 'calories' | 'protein' | 'carbs' | 'fat'> & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
