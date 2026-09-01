import { prisma } from '@/lib/prisma';
import { AddFoodDto, UpdateFoodDto } from '@/schemas/food-schemas';
import { Food } from '@prisma/client';

export class FoodRepository {
  async getAll(userId: number) {
    return prisma.food.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async search(searchTerm: string) {
    return prisma.food.findMany({
      where: {
        name: {
          contains: searchTerm,
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }

  async create(dto: AddFoodDto, userId: number) {
    return await prisma.food.create({
      data: {
        name: dto.name,
        caloriesPer100g: dto.caloriesPer100g,
        carbsPer100g: dto.carbsPer100g,
        proteinPer100g: dto.proteinPer100g,
        fatPer100g: dto.fatPer100g,
        userId,
      },
    });
  }

  async remove(foodId: number, userId: number) {
    return prisma.food.delete({
      where: {
        id: foodId,
        userId,
      },
    });
  }

  async getById(foodId: number, userId: number): Promise<Food | null> {
    return prisma.food.findFirst({
      where: {
        id: foodId,
        userId,
      },
    });
  }

  async update(dto: UpdateFoodDto, foodId: number, userId: number) {
    const food = prisma.food.findFirst({
      where: {
        id: foodId,
        userId,
      },
    });

    if (!food) {
      return null;
    }

    return await prisma.food.update({
      where: {
        id: foodId,
        userId,
      },
      data: {
        name: dto.name,
        caloriesPer100g: dto.caloriesPer100g,
        proteinPer100g: dto.proteinPer100g,
        carbsPer100g: dto.carbsPer100g,
        fatPer100g: dto.fatPer100g,
      },
    });
  }
}
