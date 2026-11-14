import { MealType, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

const mealWithItemsInclude = {
  items: {
    include: {
      product: true,
      customFood: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  },
} satisfies Prisma.MealInclude;

type MealWithItems = Prisma.MealGetPayload<{
  include: typeof mealWithItemsInclude;
}>;

// --------------------------------------------------
// DTOs
// --------------------------------------------------

type AddMealItemDto = {
  date: Date;
  type: MealType;
  quantity: number;
};

type AddProductMealItemDto = AddMealItemDto & {
  productId: number;
};

type AddCustomFoodMealItemDto = AddMealItemDto & {
  customFoodId: number;
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function normalizeDate(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class MealRepository {
  // --------------------------------------------------
  // Get meals by date
  // --------------------------------------------------

  async getMealsByDate(userId: number, date: Date): Promise<MealWithItems[]> {
    return prisma.meal.findMany({
      where: {
        userId,
        date: normalizeDate(date),
      },
      include: mealWithItemsInclude,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // --------------------------------------------------
  // Get meals by date range
  // --------------------------------------------------

  async getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MealWithItems[]> {
    return prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: normalizeDate(startDate),
          lte: normalizeDate(endDate),
        },
      },
      include: mealWithItemsInclude,
      orderBy: [
        {
          date: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });
  }

  // --------------------------------------------------
  // Get meal by ID
  // --------------------------------------------------

  async getById(id: number, userId: number): Promise<MealWithItems | null> {
    return prisma.meal.findFirst({
      where: {
        id,
        userId,
      },
      include: mealWithItemsInclude,
    });
  }

  // --------------------------------------------------
  // Find or create meal
  // --------------------------------------------------

  private async findOrCreateMeal(tx: Prisma.TransactionClient, userId: number, date: Date, type: MealType) {
    const normalizedDate = normalizeDate(date);

    const existingMeal = await tx.meal.findFirst({
      where: {
        userId,
        date: normalizedDate,
        type,
      },
    });

    if (existingMeal) {
      return existingMeal;
    }

    return tx.meal.create({
      data: {
        userId,
        date: normalizedDate,
        type,
      },
    });
  }

  // --------------------------------------------------
  // Add product to meal
  // --------------------------------------------------

  async addProductToMeal(userId: number, dto: AddProductMealItemDto): Promise<MealWithItems> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: {
          id: dto.productId,
          archivedAt: null,
        },
      });

      if (!product) {
        throw new Error('Product not found or archived.');
      }

      const meal = await this.findOrCreateMeal(tx, userId, dto.date, dto.type);

      const multiplier = dto.quantity / 100;

      await tx.mealItem.create({
        data: {
          mealId: meal.id,
          productId: product.id,
          quantity: dto.quantity,

          nameSnapshot: product.name,
          caloriesSnapshot: Number(product.calories) * multiplier,
          proteinSnapshot: Number(product.protein) * multiplier,
          carbsSnapshot: Number(product.carbs) * multiplier,
          fatSnapshot: Number(product.fat) * multiplier,
        },
      });

      return tx.meal.findFirstOrThrow({
        where: {
          id: meal.id,
          userId,
        },
        include: mealWithItemsInclude,
      });
    });
  }

  // --------------------------------------------------
  // Add custom food to meal
  // --------------------------------------------------

  async addCustomFoodToMeal(userId: number, dto: AddCustomFoodMealItemDto): Promise<MealWithItems> {
    return prisma.$transaction(async (tx) => {
      const customFood = await tx.customFood.findFirst({
        where: {
          id: dto.customFoodId,
          userId,
        },
      });

      if (!customFood) {
        throw new Error('Custom food not found.');
      }

      const meal = await this.findOrCreateMeal(tx, userId, dto.date, dto.type);

      const multiplier = dto.quantity / 100;

      await tx.mealItem.create({
        data: {
          mealId: meal.id,
          customFoodId: customFood.id,
          quantity: dto.quantity,

          nameSnapshot: customFood.name,
          caloriesSnapshot: Number(customFood.calories) * multiplier,
          proteinSnapshot: Number(customFood.protein) * multiplier,
          carbsSnapshot: Number(customFood.carbs) * multiplier,
          fatSnapshot: Number(customFood.fat) * multiplier,
        },
      });

      return tx.meal.findFirstOrThrow({
        where: {
          id: meal.id,
          userId,
        },
        include: mealWithItemsInclude,
      });
    });
  }

  // --------------------------------------------------
  // Update meal item quantity
  // --------------------------------------------------

  async updateMealItemQuantity(mealItemId: number, userId: number, quantity: number): Promise<MealWithItems> {
    return prisma.$transaction(async (tx) => {
      const mealItem = await tx.mealItem.findFirst({
        where: {
          id: mealItemId,
          meal: {
            userId,
          },
        },
        include: {
          product: true,
          customFood: true,
          meal: true,
        },
      });

      if (!mealItem) {
        throw new Error('Meal item not found.');
      }

      const food = mealItem.product ?? mealItem.customFood;

      if (!food) {
        throw new Error('Food information not found.');
      }

      const multiplier = quantity / 100;

      await tx.mealItem.update({
        where: {
          id: mealItemId,
        },
        data: {
          quantity,

          caloriesSnapshot: Number(food.calories) * multiplier,
          proteinSnapshot: Number(food.protein) * multiplier,
          carbsSnapshot: Number(food.carbs) * multiplier,
          fatSnapshot: Number(food.fat) * multiplier,
        },
      });

      return tx.meal.findFirstOrThrow({
        where: {
          id: mealItem.mealId,
          userId,
        },
        include: mealWithItemsInclude,
      });
    });
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async removeMealItem(mealItemId: number, userId: number): Promise<MealWithItems> {
    return prisma.$transaction(async (tx) => {
      const mealItem = await tx.mealItem.findFirst({
        where: {
          id: mealItemId,
          meal: {
            userId,
          },
        },
      });

      if (!mealItem) {
        throw new Error('Meal item not found.');
      }

      await tx.mealItem.delete({
        where: {
          id: mealItemId,
        },
      });

      return tx.meal.findFirstOrThrow({
        where: {
          id: mealItem.mealId,
          userId,
        },
        include: mealWithItemsInclude,
      });
    });
  }

  // --------------------------------------------------
  // Delete empty meal
  // --------------------------------------------------

  async deleteEmptyMeal(mealId: number, userId: number): Promise<void> {
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!meal) {
      throw new Error('Meal not found.');
    }

    if (meal._count.items > 0) {
      throw new Error('Cannot delete a meal that contains food items.');
    }

    await prisma.meal.delete({
      where: {
        id: mealId,
      },
    });
  }
}
