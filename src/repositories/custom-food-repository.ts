import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { CreateCustomFoodDto, UpdateCustomFoodDto } from '@/schemas/custom-food-schema';

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type CustomFood = Prisma.CustomFoodGetPayload<Record<string, never>>;

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class CustomFoodRepository {
  // --------------------------------------------------
  // Get all custom foods for user
  // --------------------------------------------------

  async getAll(userId: number, search?: string): Promise<CustomFood[]> {
    const normalizedSearch = search?.trim();

    return prisma.customFood.findMany({
      where: {
        userId,
        ...(normalizedSearch && {
          OR: [{ name: { contains: normalizedSearch } }, { brand: { contains: normalizedSearch } }],
        }),
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // --------------------------------------------------
  // Get custom food by ID
  // --------------------------------------------------

  async getById(id: number, userId: number): Promise<CustomFood | null> {
    return prisma.customFood.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  // --------------------------------------------------
  // Create custom food
  // --------------------------------------------------

  async create(dto: CreateCustomFoodDto, userId: number): Promise<CustomFood> {
    return prisma.customFood.create({
      data: {
        userId,
        name: dto.name,
        brand: dto.brand || null,
        calories: dto.calories,
        protein: dto.protein,
        carbs: dto.carbs,
        fat: dto.fat,
      },
    });
  }

  // --------------------------------------------------
  // Update custom food
  // --------------------------------------------------

  async update(id: number, dto: UpdateCustomFoodDto, userId: number): Promise<CustomFood> {
    const existing = await prisma.customFood.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      throw new Error('Custom food not found.');
    }

    return prisma.customFood.update({
      where: {
        id,
      },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.brand !== undefined && { brand: dto.brand || null }),
        ...(dto.calories !== undefined && { calories: dto.calories }),
        ...(dto.protein !== undefined && { protein: dto.protein }),
        ...(dto.carbs !== undefined && { carbs: dto.carbs }),
        ...(dto.fat !== undefined && { fat: dto.fat }),
      },
    });
  }

  // --------------------------------------------------
  // Delete custom food
  // --------------------------------------------------

  async delete(id: number, userId: number): Promise<void> {
    const existing = await prisma.customFood.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      throw new Error('Custom food not found.');
    }

    const mealItemCount = await prisma.mealItem.count({
      where: {
        customFoodId: id,
        meal: {
          userId,
        },
      },
    });

    if (mealItemCount > 0) {
      throw new Error('Cannot delete a custom food that is used in meal history.');
    }

    await prisma.customFood.delete({
      where: {
        id,
      },
    });
  }
}
