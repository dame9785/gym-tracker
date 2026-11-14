import type { MealType } from '@prisma/client';

import { MealRepository } from '@/repositories/meal-repository';

// --------------------------------------------------
// Service
// --------------------------------------------------

export class MealService {
  constructor(private readonly mealRepository = new MealRepository()) {}

  // --------------------------------------------------
  // Get meals by date
  // --------------------------------------------------

  async getMealsByDate(userId: number, date: Date) {
    return this.mealRepository.getMealsByDate(userId, date);
  }

  // --------------------------------------------------
  // Get meals by date range
  // --------------------------------------------------

  async getMealsByDateRange(userId: number, startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date.');
    }

    return this.mealRepository.getMealsByDateRange(userId, startDate, endDate);
  }

  // --------------------------------------------------
  // Get meal by ID
  // --------------------------------------------------

  async getById(id: number, userId: number) {
    return this.mealRepository.getById(id, userId);
  }

  // --------------------------------------------------
  // Add product to meal
  // --------------------------------------------------

  async addProductToMeal(
    userId: number,
    dto: {
      productId: number;
      date: Date;
      type: MealType;
      quantity: number;
    },
  ) {
    this.validateQuantity(dto.quantity);

    return this.mealRepository.addProductToMeal(userId, dto);
  }

  // --------------------------------------------------
  // Add custom food to meal
  // --------------------------------------------------

  async addCustomFoodToMeal(
    userId: number,
    dto: {
      customFoodId: number;
      date: Date;
      type: MealType;
      quantity: number;
    },
  ) {
    this.validateQuantity(dto.quantity);

    return this.mealRepository.addCustomFoodToMeal(userId, dto);
  }

  // --------------------------------------------------
  // Update meal item quantity
  // --------------------------------------------------

  async updateMealItemQuantity(mealItemId: number, userId: number, quantity: number) {
    this.validateQuantity(quantity);

    return this.mealRepository.updateMealItemQuantity(mealItemId, userId, quantity);
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async removeMealItem(mealItemId: number, userId: number) {
    return this.mealRepository.removeMealItem(mealItemId, userId);
  }

  // --------------------------------------------------
  // Delete empty meal
  // --------------------------------------------------

  async deleteEmptyMeal(mealId: number, userId: number) {
    return this.mealRepository.deleteEmptyMeal(mealId, userId);
  }

  // --------------------------------------------------
  // Private validation
  // --------------------------------------------------

  private validateQuantity(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000) {
      throw new Error('Invalid meal quantity.');
    }
  }
}
