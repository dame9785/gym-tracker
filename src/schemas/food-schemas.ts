import { z } from 'zod';

export const addFoodSchema = z.object({
  name: z.string().trim().min(1, 'You must enter a name.'),

  caloriesPer100g: z.coerce.number().min(1, 'You must enter the number of calories.'),

  proteinPer100g: z.coerce.number().min(1, 'You must enter the number of proteins.'),

  carbsPer100g: z.coerce.number().min(1, 'You must enter the number of carbs.'),

  fatPer100g: z.coerce.number().min(0, 'Fat cannot be negative.'),
});

export const updateFoodSchema = addFoodSchema;

export type AddFoodDto = z.infer<typeof addFoodSchema>;
export type UpdateFoodDto = z.infer<typeof updateFoodSchema>;
