import { z } from 'zod';
export const calorieCalculatorSchema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().positive(),
  gender: z.enum(['MALE', 'FEMALE']),
  activityLevel: z.enum(['SEDENTARY', 'LIGHT', 'MODERATE', 'VERY_ACTIVE', 'EXTRA_ACTIVE']),
});

export const calorieLogSchema = z.object({
  calories: z.coerce.number().min(0, 'Kalorier kan inte vara mindre än 0').max(10000, 'Ange ett rimligt antal kalorier'),
});
