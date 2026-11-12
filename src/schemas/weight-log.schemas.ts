import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const weightSchema = z.coerce.number().finite('Vikten måste vara ett giltigt nummer.').positive('Vikten måste vara större än 0.');

const noteSchema = z.string().trim().min(1, 'Du måste fylla i anteckning');

// --------------------------------------------------
// Add weight schema
// --------------------------------------------------

export const addWeightSchema = z.object({
  weight: weightSchema,
  note: noteSchema,
});

// --------------------------------------------------
// Update weight schema
// --------------------------------------------------

export const updateWeightSchema = addWeightSchema;

// --------------------------------------------------
// DTOs
// --------------------------------------------------

export type AddWeightDto = z.infer<typeof addWeightSchema>;
export type UpdateWeightDto = z.infer<typeof updateWeightSchema>;
