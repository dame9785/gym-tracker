import { z } from 'zod';

export const addWeightSchema = z.object({
  weight: z.coerce.number('Vikt får enbart ha siffror').min(20, 'Ogiltig vikt').max(400, 'Ogiltig vikt'),
  note: z.string().trim().min(1, 'Du måste fylla i anteckning'),
});

export const editWeightSchema = addWeightSchema;

/*Weight Dtos*/
export type AddWeightDto = z.infer<typeof addWeightSchema>;
export type EditWeightDto = z.infer<typeof editWeightSchema>;
