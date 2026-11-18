import type { Product } from '@/types/product-types';
import type { ProductViewModel } from '@/types/product-types';

// --------------------------------------------------
// Product mapper
// --------------------------------------------------

export function mapProduct(product: Product): ProductViewModel {
  return {
    ...product,
    calories: Number(product.calories),
    protein: Number(product.protein),
    carbs: Number(product.carbs),
    fat: Number(product.fat),
  };
}
