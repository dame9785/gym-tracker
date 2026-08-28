import { prisma } from '@/lib/prisma';

export class FoodRepository {
  async getAll() {
    return prisma.food.findMany({
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

  async getById(id: number) {
    return prisma.food.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: { name: string; caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number }) {
    return prisma.food.create({
      data,
    });
  }

  async removeFoodFromMeal(mealItemId: number) {
    return prisma.mealItem.delete({
      where: {
        id: mealItemId,
      },
    });
  }
}
