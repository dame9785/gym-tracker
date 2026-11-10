import { z } from 'zod';

import type { ExternalFood, FoodProvider, FoodSearchOptions } from './food-provider';

const BASE_URL = 'https://dataportal.livsmedelsverket.se/livsmedel/api/v1';

const PAGE_SIZE = 100;
const CACHE_TTL = 24 * 60 * 60 * 1000;

const NutrientSchema = z.object({
  euroFIRkod: z.string(),
  namn: z.string(),
  varde: z.union([z.number(), z.string()]),
  enhet: z.string(),
  viktGram: z.number(),
});

const FoodSchema = z.object({
  nummer: z.number(),
  namn: z.string(),
});

const FoodListSchema = z.object({
  livsmedel: z.array(FoodSchema),
});

const NutrientListSchema = z.array(NutrientSchema);

type Nutrient = z.infer<typeof NutrientSchema>;
type Food = z.infer<typeof FoodSchema>;

// Shared cache across provider instances in the same server process.
let foodListCache: {
  foods: Food[];
  expiresAt: number;
} | null = null;

let foodListRequest: Promise<Food[]> | null = null;

export class LivsmedelsverketProvider implements FoodProvider {
  private async request<T>(url: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GymTracker/1.0 (food-data-integration)',
      },
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Livsmedelsverket API error: ${response.status}`);
    }

    const json: unknown = await response.json();

    return schema.parse(json);
  }

  /**
   * Fetch all foods using API pagination.
   */
  private async fetchAllFoods(): Promise<Food[]> {
    const foods: Food[] = [];
    let offset = 0;

    while (true) {
      const url = `${BASE_URL}/livsmedel?offset=${offset}` + `&limit=${PAGE_SIZE}&sprak=1`;

      const response = await this.request(url, FoodListSchema);

      foods.push(...response.livsmedel);

      if (response.livsmedel.length < PAGE_SIZE) {
        break;
      }

      offset += PAGE_SIZE;
    }

    return foods;
  }

  /**
   * Get cached food list or fetch it when necessary.
   */
  private async getFoodList(): Promise<Food[]> {
    if (foodListCache && foodListCache.expiresAt > Date.now()) {
      return foodListCache.foods;
    }

    if (!foodListRequest) {
      foodListRequest = this.fetchAllFoods();
    }

    try {
      const foods = await foodListRequest;

      foodListCache = {
        foods,
        expiresAt: Date.now() + CACHE_TTL,
      };

      return foods;
    } finally {
      foodListRequest = null;
    }
  }

  private getNutrient(nutrients: Nutrient[], code: string, unit: string): number | null {
    const nutrient = nutrients.find((item) => item.euroFIRkod === code && item.enhet.toLowerCase() === unit.toLowerCase());

    if (!nutrient) {
      return null;
    }

    const value = typeof nutrient.varde === 'number' ? nutrient.varde : Number(nutrient.varde.replace(',', '.'));

    return Number.isFinite(value) ? value : null;
  }

  private async getNutrients(foodId: number): Promise<Nutrient[]> {
    const url = `${BASE_URL}/livsmedel/${foodId}/naringsvarden?sprak=1`;

    return this.request(url, NutrientListSchema);
  }

  private async mapFood(food: Food): Promise<ExternalFood | null> {
    const nutrients = await this.getNutrients(food.nummer);

    const calories = this.getNutrient(nutrients, 'ENERC', 'kcal');
    const protein = this.getNutrient(nutrients, 'PROT', 'g');
    const carbs = this.getNutrient(nutrients, 'CHO', 'g');
    const fat = this.getNutrient(nutrients, 'FAT', 'g');

    if (calories === null || protein === null || carbs === null || fat === null) {
      return null;
    }

    return {
      externalId: String(food.nummer),
      source: 'LIVSMEDELSVERKET',
      name: food.namn,
      brand: null,
      barcode: null,
      caloriesPer100g: calories,
      proteinPer100g: protein,
      carbsPer100g: carbs,
      fatPer100g: fat,
    };
  }

  async searchFoods(query: string, options: FoodSearchOptions = {}): Promise<ExternalFood[]> {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length < 2) {
      return [];
    }

    const limit = Math.min(Math.max(options.limit ?? 10, 1), 20);

    const foods = await this.getFoodList();

    const matchingFoods = foods.filter((food) => food.namn.toLowerCase().includes(normalizedQuery)).slice(0, limit);

    const results = await Promise.allSettled(matchingFoods.map((food) => this.mapFood(food)));

    return results
      .filter((result): result is PromiseFulfilledResult<ExternalFood | null> => result.status === 'fulfilled')
      .map((result) => result.value)
      .filter((food): food is ExternalFood => food !== null);
  }

  async getFoodByBarcode(_barcode: string): Promise<ExternalFood | null> {
    return null;
  }

  /**
   * Get a food directly by its Livsmedelsverket ID.
   */
  async getFoodById(foodId: number): Promise<ExternalFood | null> {
    if (!Number.isInteger(foodId) || foodId <= 0) {
      return null;
    }

    const foods = await this.getFoodList();

    const food = foods.find((item) => item.nummer === foodId);

    if (!food) {
      return null;
    }

    return this.mapFood(food);
  }
}
