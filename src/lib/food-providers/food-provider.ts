export type FoodProviderSource = 'OPEN_FOOD_FACTS' | 'USDA' | 'LIVSMEDELSVERKET';

export type ExternalFood = {
  externalId: string;
  source: FoodProviderSource;

  name: string;
  brand: string | null;
  barcode: string | null;

  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export type FoodSearchOptions = {
  limit?: number;
};

export interface FoodProvider {
  searchFoods(query: string, options?: FoodSearchOptions): Promise<ExternalFood[]>;

  getFoodByBarcode(barcode: string): Promise<ExternalFood | null>;
}
