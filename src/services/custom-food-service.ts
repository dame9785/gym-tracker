import { CustomFoodRepository } from '@/repositories/custom-food-repository';

import { createCustomFoodSchema, updateCustomFoodSchema } from '@/schemas/custom-food-schema';

import type { CreateCustomFoodDto, UpdateCustomFoodDto } from '@/schemas/custom-food-schema';

// --------------------------------------------------
// Service
// --------------------------------------------------

export class CustomFoodService {
  constructor(private readonly customFoodRepository = new CustomFoodRepository()) {}

  // --------------------------------------------------
  // Get all custom foods
  // --------------------------------------------------

  async getAll(userId: number, search?: string) {
    return this.customFoodRepository.getAll(userId, search);
  }

  // --------------------------------------------------
  // Get custom food by ID
  // --------------------------------------------------

  async getById(id: number, userId: number) {
    const customFood = await this.customFoodRepository.getById(id, userId);

    if (!customFood) {
      throw new Error('Custom food not found.');
    }

    return customFood;
  }

  // --------------------------------------------------
  // Create custom food
  // --------------------------------------------------

  async create(dto: CreateCustomFoodDto, userId: number) {
    const validation = createCustomFoodSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    return this.customFoodRepository.create(validation.data, userId);
  }

  // --------------------------------------------------
  // Update custom food
  // --------------------------------------------------

  async update(id: number, dto: UpdateCustomFoodDto, userId: number) {
    const validation = updateCustomFoodSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    return this.customFoodRepository.update(id, validation.data, userId);
  }

  // --------------------------------------------------
  // Delete custom food
  // --------------------------------------------------

  async delete(id: number, userId: number): Promise<void> {
    await this.customFoodRepository.delete(id, userId);
  }
}
