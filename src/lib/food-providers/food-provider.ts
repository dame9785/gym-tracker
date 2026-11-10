export type FoodProviderSource = 'LIVSMEDELSVERKET';

export type ExternalFood = {
  externalId: string;
  source: FoodProviderSource;

  name: string;
  brand: string | null;
  barcode: string | null;
  imageUrl: string | null;

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
}
