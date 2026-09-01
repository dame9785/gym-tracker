import { z } from 'zod';

export const addWeightSchema = z.object({
  weight: z.coerce.number(),
  note: z.string().trim().min(1, 'Du måste fylla i anteckning'),
});

export const updateWeightSchema = addWeightSchema;

/*Weight Dtos*/
export type AddWeightDto = z.infer<typeof addWeightSchema>;
export type UpdateWeightDto = z.infer<typeof updateWeightSchema>;
