import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const customFoodNameSchema = z.string().trim().min(2, 'Food name must be at least 2 characters long.').max(191, 'Food name can be maximum 191 characters long.');

const optionalTextSchema = (maxLength: number, message: string) => z.string().trim().max(maxLength, message).optional().or(z.literal(''));

const nutritionSchema = {
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
};

// --------------------------------------------------
// Create custom food
// --------------------------------------------------

export const createCustomFoodSchema = z.object({
  name: customFoodNameSchema,
  brand: optionalTextSchema(100, 'Brand can be maximum 100 characters long.'),
  ...nutritionSchema,
});

// --------------------------------------------------
// Update custom food
// --------------------------------------------------

export const updateCustomFoodSchema = createCustomFoodSchema.partial();

// --------------------------------------------------
// DTO types
// --------------------------------------------------

export type CreateCustomFoodDto = z.infer<typeof createCustomFoodSchema>;
export type UpdateCustomFoodDto = z.infer<typeof updateCustomFoodSchema>;
