import { prisma } from '@/lib/prisma';
import type { ExternalFood } from '@/lib/food-providers/food-provider';

export class FoodRepository {
  /**
   * Search foods already saved by the user.
   */
  async searchFoods(userId: number, query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    return prisma.food.findMany({
      where: {
        userId,
        name: {
          contains: normalizedQuery,
        },
      },
      include: {
        servings: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }

  /**
   * Get a specific food belonging to the user.
   */
  async getFoodById(userId: number, foodId: number) {
    return prisma.food.findFirst({
      where: {
        id: foodId,
        userId,
      },
      include: {
        servings: true,
      },
    });
  }

  /**
   * Save an external food or update an existing imported food.
   */
  async saveExternalFood(userId: number, food: ExternalFood) {
    return prisma.food.upsert({
      where: {
        userId_source_externalId: {
          userId,
          source: food.source,
          externalId: food.externalId,
        },
      },
      create: {
        userId,
        name: food.name,
        brand: food.brand,
        barcode: food.barcode,
        externalId: food.externalId,
        source: food.source,
        caloriesPer100g: food.caloriesPer100g,
        proteinPer100g: food.proteinPer100g,
        carbsPer100g: food.carbsPer100g,
        fatPer100g: food.fatPer100g,
      },
      update: {
        name: food.name,
        brand: food.brand,
        barcode: food.barcode,
        caloriesPer100g: food.caloriesPer100g,
        proteinPer100g: food.proteinPer100g,
        carbsPer100g: food.carbsPer100g,
        fatPer100g: food.fatPer100g,
      },
      include: {
        servings: true,
      },
    });
  }

  /**
   * Find a previously saved food using its barcode.
   */
  async getFoodByBarcode(userId: number, barcode: string) {
    return prisma.food.findFirst({
      where: {
        userId,
        barcode,
      },
      include: {
        servings: true,
      },
    });
  }

  /**
   * Get all foods saved by the user.
   */
  async getAllFoods(userId: number) {
    return prisma.food.findMany({
      where: {
        userId,
      },
      include: {
        servings: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get external foods already imported by the user.
   */
  /**
   * Get all external foods already imported by the user.
   */
  async getImportedFoods(userId: number) {
    return prisma.food.findMany({
      where: {
        userId,
        source: {
          in: ['OPEN_FOOD_FACTS', 'LIVSMEDELSVERKET', 'USDA'],
        },
      },
      select: {
        externalId: true,
        barcode: true,
        source: true,
      },
    });
  }
}
