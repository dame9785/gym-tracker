import { FoodRepository } from '@/repositories/food-repository';
import { LivsmedelsverketProvider } from '@/lib/food-providers/livsmedelsverket-provider';

import type { ExternalFood } from '@/lib/food-providers/food-provider';

const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 100;
const MAX_RESULTS = 10;

export class FoodService {
  constructor(
    private readonly foodRepository = new FoodRepository(),
    private readonly livsmedelsverketProvider = new LivsmedelsverketProvider(),
  ) {}

  /**
   * Search for foods in the user's local database
   * and Livsmedelsverket.
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

    const [localResult, importedResult, livsmedelsverketResult] = await Promise.allSettled([
      this.foodRepository.searchFoods(userId, normalizedQuery),
      this.foodRepository.getImportedFoods(userId),
      this.livsmedelsverketProvider.searchFoods(normalizedQuery, {
        limit: MAX_RESULTS,
      }),
    ]);

    if (localResult.status === 'rejected') {
      throw localResult.reason;
    }

    if (importedResult.status === 'rejected') {
      throw importedResult.reason;
    }

    const localFoods = localResult.value;

    const externalSearchFailed = livsmedelsverketResult.status === 'rejected';

    const externalFoods = livsmedelsverketResult.status === 'fulfilled' ? livsmedelsverketResult.value : [];

    const filteredExternalFoods = this.removeAlreadySavedFoods(externalFoods, importedResult.value);

    return {
      localFoods,
      externalFoods: filteredExternalFoods.slice(0, MAX_RESULTS),
      externalSearchFailed,
    };
  }

  /**
   * Import an external food into the user's food library.
   */
  async importExternalFood(userId: number, food: ExternalFood) {
    this.validateUserId(userId);
    this.validateExternalFood(food);

    return this.foodRepository.saveExternalFood(userId, food);
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
    if (!food.externalId || food.source !== 'LIVSMEDELSVERKET' || !food.name.trim()) {
      throw new Error('Invalid external food data.');
    }

    const nutrients = [food.caloriesPer100g, food.proteinPer100g, food.carbsPer100g, food.fatPer100g];

    if (nutrients.some((value) => !Number.isFinite(value) || value < 0 || value > 1000)) {
      throw new Error('Invalid nutritional values.');
    }
  }

  /**
   * Import an external food using its Livsmedelsverket ID.
   */
  async importExternalFoodById(userId: number, source: 'LIVSMEDELSVERKET', externalId: string) {
    this.validateUserId(userId);

    if (source !== 'LIVSMEDELSVERKET') {
      throw new Error('Invalid food source.');
    }

    const normalizedId = externalId.trim();

    if (!normalizedId || normalizedId.length > 191) {
      throw new Error('Invalid external food ID.');
    }

    if (!/^\d+$/.test(normalizedId)) {
      throw new Error('Invalid Livsmedelsverket food ID.');
    }

    const externalFood = await this.livsmedelsverketProvider.getFoodById(Number(normalizedId));

    if (!externalFood) {
      throw new Error('Food product not found.');
    }

    if (externalFood.source !== 'LIVSMEDELSVERKET') {
      throw new Error('Food source mismatch.');
    }

    this.validateExternalFood(externalFood);

    return this.foodRepository.saveExternalFood(userId, externalFood);
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

  /**
   * Get featured foods for the initial food library search view.
   */
  async getFeaturedFoods(userId: number) {
    this.validateUserId(userId);

    const [featuredFoods, importedFoods] = await Promise.all([this.livsmedelsverketProvider.getFeaturedFoods(10), this.foodRepository.getImportedFoods(userId)]);

    return this.removeAlreadySavedFoods(featuredFoods, importedFoods);
  }
}
