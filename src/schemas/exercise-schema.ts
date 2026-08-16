import { z } from 'zod';

export const registerExerciseSchema = z.object({
  name: z.string().trim().min(3, 'Namn måste vara minst 3 tecken.').max(20, 'Namn får vara högst 20 tecken.'),

  muscleGroup: z
    .string()
    .trim()
    .min(3, 'Muskelgrupp måste vara minst 3 tecken.')
    .max(20, 'Muskelgrupp får vara högst 20 tecken.'),

  equipment: z
    .string()
    .trim()
    .min(3, 'Utrustning måste vara minst 3 tecken.')
    .max(20, 'Utrustning får vara högst 20 tecken.'),
});

export const updateExerciseSchema = registerExerciseSchema;

export type RegisterExericseDto = z.infer<typeof registerExerciseSchema>;
export type UpdateExericseDto = z.infer<typeof updateExerciseSchema>;
