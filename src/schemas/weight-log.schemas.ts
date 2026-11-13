import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const weightSchema = z.coerce.number().finite('Weight must be a valid number.').positive('Weight must be greater than 0.');

const noteSchema = z.string().trim().min(1, 'Note is required.');

const weightFields = {
  weight: weightSchema,
  note: noteSchema,
};

// --------------------------------------------------
// Add weight schema
// --------------------------------------------------

export const addWeightSchema = z.object(weightFields);

// --------------------------------------------------
// Update weight schema
// --------------------------------------------------

export const updateWeightSchema = z.object(weightFields);

// --------------------------------------------------
// DTOs
// --------------------------------------------------

export type AddWeightDto = z.infer<typeof addWeightSchema>;
export type UpdateWeightDto = z.infer<typeof updateWeightSchema>;
