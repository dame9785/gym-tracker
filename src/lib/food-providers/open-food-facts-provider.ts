import { z } from 'zod';

import type { ExternalFood, FoodProvider, FoodSearchOptions } from './food-provider';

const BASE_URL = 'https://world.openfoodfacts.org';

const USER_AGENT = 'GymTracker/1.0 (food-data-integration)';

const ProductSchema = z.object({
  code: z.string().optional(),
  product_name: z.string().nullish(),
  product_name_sv: z.string().nullish(),
  product_name_en: z.string().nullish(),
  brands: z.string().nullish(),
  nutriments: z
    .object({
      'energy-kcal_100g': z.number().nullish(),
      'energy-kj_100g': z.number().nullish(),
      proteins_100g: z.number().nullish(),
      carbohydrates_100g: z.number().nullish(),
      fat_100g: z.number().nullish(),
    })
    .nullish(),
});

const SearchResponseSchema = z.object({
  products: z.array(z.unknown()),
});

const ProductResponseSchema = z.object({
  status: z.number(),
  product: z.unknown().optional(),
});

export class OpenFoodFactsProvider implements FoodProvider {
  private readonly fields = 'code,product_name,product_name_sv,product_name_en,brands,nutriments';

  private async request<T>(url: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const json: unknown = await response.json();

    return schema.parse(json);
  }

  private mapProduct(data: unknown): ExternalFood | null {
    const result = ProductSchema.safeParse(data);

    if (!result.success) {
      return null;
    }

    const product = result.data;
    const nutrients = product.nutriments;

    if (!nutrients || !product.code) {
      return null;
    }

    const calories = nutrients['energy-kcal_100g'] ?? (nutrients['energy-kj_100g'] != null ? nutrients['energy-kj_100g'] / 4.184 : null);

    const protein = nutrients.proteins_100g;
    const carbs = nutrients.carbohydrates_100g;
    const fat = nutrients.fat_100g;

    if (calories == null || protein == null || carbs == null || fat == null) {
      return null;
    }

    const name = product.product_name_sv?.trim() || product.product_name?.trim() || product.product_name_en?.trim();

    if (!name) {
      return null;
    }

    return {
      externalId: product.code,
      source: 'OPEN_FOOD_FACTS',
      name,
      brand: product.brands?.trim() || null,
      barcode: product.code,
      caloriesPer100g: calories,
      proteinPer100g: protein,
      carbsPer100g: carbs,
      fatPer100g: fat,
    };
  }

  async searchFoods(query: string, options: FoodSearchOptions = {}): Promise<ExternalFood[]> {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return [];
    }

    const limit = Math.min(Math.max(options.limit ?? 10, 1), 20);

    const params = new URLSearchParams({
      search_terms: normalizedQuery,
      page_size: String(limit),
      fields: this.fields,
    });

    const url = `${BASE_URL}/api/v2/search?${params}`;

    const response = await this.request(url, SearchResponseSchema);

    return response.products.map((product) => this.mapProduct(product)).filter((food): food is ExternalFood => food !== null);
  }

  async getFoodByBarcode(barcode: string): Promise<ExternalFood | null> {
    const normalizedBarcode = barcode.trim();

    if (!/^\d{8,14}$/.test(normalizedBarcode)) {
      return null;
    }

    const params = new URLSearchParams({
      fields: this.fields,
    });

    const url = `${BASE_URL}/api/v3/product/` + `${encodeURIComponent(normalizedBarcode)}?${params}`;

    const response = await this.request(url, ProductResponseSchema);

    if (response.status !== 1 || !response.product) {
      return null;
    }

    return this.mapProduct(response.product);
  }
}
