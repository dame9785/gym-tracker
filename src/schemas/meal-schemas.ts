import { z } from 'zod';

export const addMealItemSchema = z.object({
  foodId: z.coerce.number().int().positive('Food måste väljas'),
  grams: z.coerce.number().positive('Gram måste vara större än 0'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
});

export const addMealSchema = z.object({
  foodId: z.number().int().positive('You must select a food'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  grams: z.number().positive('Amount must be greater than 0'),
});

export type AddMealDto = z.infer<typeof addMealSchema>;
export type AddMealItemDto = z.infer<typeof addMealItemSchema>;
