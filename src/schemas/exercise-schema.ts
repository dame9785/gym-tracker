import { z } from 'zod';

export const registerExerciseSchema = z.object({
  name: z.string().trim().min(3, 'The name ust be at least 3 characters.').max(50, 'Names can maximum be 50 characters long.'),
  muscleGroup: z.string().trim().min(3, 'Muscle group must be at least 3 characters long.').max(20, 'Muscle group name can maximum of 20 characters long.'),
  equipment: z.string().trim().max(20, 'Equipment can maximum be 20 characters.').optional().or(z.literal('')),
  imagePath: z.string().nullable().optional(),
});

export const updateExerciseSchema = registerExerciseSchema;

export type RegisterExericseDto = z.infer<typeof registerExerciseSchema>;
export type UpdateExericseDto = z.infer<typeof updateExerciseSchema>;
