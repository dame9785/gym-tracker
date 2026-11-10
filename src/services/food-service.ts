import { FoodRepository } from '@/repositories/food-repository';
import { OpenFoodFactsProvider } from '@/lib/food-providers/open-food-facts-provider';
import { LivsmedelsverketProvider } from '@/lib/food-providers/livsmedelsverket-provider';

import type { ExternalFood } from '@/lib/food-providers/food-provider';

import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 100;
const MAX_RESULTS = 10;

const MAX_FOOD_IMAGE_SIZE = 5 * 1024 * 1024;

const FOOD_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

async function uploadFoodImage(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' || url.hostname !== 'images.openfoodfacts.org') {
    return null;
  }

  try {
    const response = await fetch(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();

    if (!contentType || !(contentType in FOOD_IMAGE_TYPES)) {
      return null;
    }

    const contentLength = Number(response.headers.get('content-length'));

    if (contentLength > MAX_FOOD_IMAGE_SIZE) {
      return null;
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    if (imageBuffer.length === 0 || imageBuffer.length > MAX_FOOD_IMAGE_SIZE) {
      return null;
    }

    const extension = FOOD_IMAGE_TYPES[contentType as keyof typeof FOOD_IMAGE_TYPES];

    const blob = await put(`food/${randomUUID()}.${extension}`, imageBuffer, {
      access: 'public',
      contentType,
    });

    return blob.url;
  } catch (error) {
    console.error('Failed to upload food image:', error);
    return null;
  }
}

export class FoodService {
  constructor(
    private readonly foodRepository = new FoodRepository(),
    private readonly foodProvider = new OpenFoodFactsProvider(),
    private readonly livsmedelsverketProvider = new LivsmedelsverketProvider(),
  ) {}

  /**
   * Search for foods in the user's local database
   * and in external food providers.
   */
  async searchFoods(userId: number, query: string) {
    this.validateUserId(userId);

    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_SEARCH_LENGTH || normalizedQuery.length > MAX_SEARCH_LENGTH) {
      return {
        localFoods: [],
        externalFoods: [],
        externalSearchFailed: false,
      };
    }

    const [localResult, importedResult, openFoodFactsResult, livsmedelsverketResult] = await Promise.allSettled([
      this.foodRepository.searchFoods(userId, normalizedQuery),
      this.foodRepository.getImportedFoods(userId),
      this.foodProvider.searchFoods(normalizedQuery, {
        limit: MAX_RESULTS,
      }),

      this.livsmedelsverketProvider.searchFoods(normalizedQuery, {
        limit: MAX_RESULTS,
      }),
    ]);

    console.log('Open Food Facts:', openFoodFactsResult);
    console.log('Livsmedelsverket:', livsmedelsverketResult);

    if (localResult.status === 'rejected') {
      throw localResult.reason;
    }

    if (importedResult.status === 'rejected') {
      throw importedResult.reason;
    }

    const localFoods = localResult.value;

    const externalSearchFailed = openFoodFactsResult.status === 'rejected' && livsmedelsverketResult.status === 'rejected';

    const externalFoods = [...(openFoodFactsResult.status === 'fulfilled' ? openFoodFactsResult.value : []), ...(livsmedelsverketResult.status === 'fulfilled' ? livsmedelsverketResult.value : [])];

    const filteredExternalFoods = this.removeAlreadySavedFoods(externalFoods, importedResult.value);

    return {
      localFoods,
      externalFoods: filteredExternalFoods.slice(0, MAX_RESULTS * 2),
      externalSearchFailed,
    };
  }

  /**
   * Import an external food into the user's food library.
   */
  async importExternalFood(userId: number, food: ExternalFood) {
    this.validateUserId(userId);
    this.validateExternalFood(food);

    const imageUrl = await uploadFoodImage(food.imageUrl);

    return this.foodRepository.saveExternalFood(userId, {
      ...food,
      imageUrl,
    });
  }

  /**
   * Search for a food using its barcode.
   */
  async getFoodByBarcode(userId: number, barcode: string) {
    this.validateUserId(userId);

    const normalizedBarcode = barcode.trim();

    if (!/^\d{8,14}$/.test(normalizedBarcode)) {
      throw new Error('Invalid barcode.');
    }

    const localFood = await this.foodRepository.getFoodByBarcode(userId, normalizedBarcode);

    if (localFood) {
      return {
        source: 'LOCAL' as const,
        food: localFood,
      };
    }

    const externalFood = await this.foodProvider.getFoodByBarcode(normalizedBarcode);

    if (!externalFood) {
      return null;
    }

    return {
      source: 'EXTERNAL' as const,
      food: externalFood,
    };
  }

  /**
   * Remove external products that already exist locally.
   */
  private removeAlreadySavedFoods(
    externalFoods: ExternalFood[],
    importedFoods: {
      externalId: string | null;
      barcode: string | null;
      source: string;
    }[],
  ) {
    const savedExternalFoods = new Set(importedFoods.filter((food): food is typeof food & { externalId: string } => food.externalId !== null).map((food) => `${food.source}:${food.externalId}`));

    const savedBarcodes = new Set(importedFoods.map((food) => food.barcode).filter((barcode): barcode is string => barcode !== null));

    return externalFoods.filter((food) => !savedExternalFoods.has(`${food.source}:${food.externalId}`) && (!food.barcode || !savedBarcodes.has(food.barcode)));
  }
  /**
   * Validate user ID.
   */
  private validateUserId(userId: number): void {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID.');
    }
  }

  /**
   * Validate external food data before importing.
   */
  private validateExternalFood(food: ExternalFood): void {
    const allowedSources = ['OPEN_FOOD_FACTS', 'USDA', 'LIVSMEDELSVERKET'];

    if (!food.externalId || !allowedSources.includes(food.source) || !food.name.trim()) {
      throw new Error('Invalid external food data.');
    }

    const nutrients = [food.caloriesPer100g, food.proteinPer100g, food.carbsPer100g, food.fatPer100g];

    if (nutrients.some((value) => !Number.isFinite(value) || value < 0 || value > 1000)) {
      throw new Error('Invalid nutritional values.');
    }
  }

  /**
   * Import a product using its barcode.
   */
  async importFoodByBarcode(userId: number, barcode: string) {
    this.validateUserId(userId);

    const normalizedBarcode = barcode.trim();

    if (!/^\d{8,14}$/.test(normalizedBarcode)) {
      throw new Error('Invalid barcode.');
    }

    const existingFood = await this.foodRepository.getFoodByBarcode(userId, normalizedBarcode);

    if (existingFood) {
      return existingFood;
    }

    const externalFood = await this.foodProvider.getFoodByBarcode(normalizedBarcode);

    if (!externalFood) {
      throw new Error('Food product not found.');
    }

    if (externalFood.barcode !== normalizedBarcode) {
      throw new Error('Barcode mismatch.');
    }

    this.validateExternalFood(externalFood);

    const imageUrl = await uploadFoodImage(externalFood.imageUrl);

    return this.foodRepository.saveExternalFood(userId, {
      ...externalFood,
      imageUrl,
    });
  }

  /**
   * Import an external food using its source and external ID.
   */
  async importExternalFoodById(userId: number, source: 'OPEN_FOOD_FACTS' | 'LIVSMEDELSVERKET', externalId: string) {
    this.validateUserId(userId);

    const normalizedId = externalId.trim();

    if (!normalizedId || normalizedId.length > 191) {
      throw new Error('Invalid external food ID.');
    }

    let externalFood: ExternalFood | null = null;

    if (source === 'OPEN_FOOD_FACTS') {
      externalFood = await this.foodProvider.getFoodByBarcode(normalizedId);

      if (externalFood?.externalId !== normalizedId) {
        externalFood = null;
      }
    }

    if (source === 'LIVSMEDELSVERKET') {
      if (!/^\d+$/.test(normalizedId)) {
        throw new Error('Invalid Livsmedelsverket food ID.');
      }

      externalFood = await this.livsmedelsverketProvider.getFoodById(Number(normalizedId));
    }

    if (!externalFood) {
      throw new Error('Food product not found.');
    }

    if (externalFood.source !== source) {
      throw new Error('Food source mismatch.');
    }

    this.validateExternalFood(externalFood);

    const imageUrl = await uploadFoodImage(externalFood.imageUrl);

    return this.foodRepository.saveExternalFood(userId, {
      ...externalFood,
      imageUrl,
    });
  }

  /**
   * Get all foods saved by the user.
   */
  async getAllFoods(userId: number) {
    this.validateUserId(userId);

    return this.foodRepository.getAllFoods(userId);
  }

  /**
   * Delete an imported food from the user's food library.
   */

  async deleteFood(userId: number, foodId: number): Promise<boolean> {
    this.validateUserId(userId);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      throw new Error('Invalid food ID.');
    }

    return this.foodRepository.deleteFood(userId, foodId);
  }
}
