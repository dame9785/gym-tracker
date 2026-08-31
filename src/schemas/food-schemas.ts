import { z } from 'zod';

export const addFoodSchema = z.object({
  name: z.string().trim().min(1, 'You must enter a name.'),
  caloriesPer100g: z.number().min(1, 'You must enter the number of calories.'),
  proteinPer100g: z.number().min(1, 'You must enter the number of proteins.'),
  carbsPer100g: z.number().min(1, 'You must enter the number of carbs'),
  fatPer100g: z.number(),
});

export type AddFoodDto = z.infer<typeof addFoodSchema>;
