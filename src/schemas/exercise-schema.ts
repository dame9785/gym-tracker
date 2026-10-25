import { z } from 'zod';

const muscleNameSchema = z.string().trim().min(2, 'Muscle group must be at least 2 characters long.').max(50, 'Muscle group can be maximum 50 characters long.');

export const registerExerciseSchema = z.object({
  name: z.string().trim().min(3, 'The name must be at least 3 characters.').max(50, 'Names can be maximum 50 characters long.'),

  primaryMuscle: muscleNameSchema,

  secondaryMuscles: z
    .array(muscleNameSchema)
    .default([])
    .refine((muscles) => new Set(muscles.map((m) => m.toLowerCase())).size === muscles.length, 'Secondary muscle groups cannot contain duplicates.'),

  equipment: z.string().trim().max(50, 'Equipment can be maximum 50 characters long.').optional().or(z.literal('')),

  description: z.string().trim().min(10, 'Description must be at least 10 characters long.').max(2000, 'Description can be maximum 2000 characters long.'),

  instructions: z.string().trim().min(10, 'Instructions must be at least 10 characters long.').max(4000, 'Instructions can be maximum 4000 characters long.'),

  techniqueTips: z.string().trim().max(2000, 'Technique tips can be maximum 2000 characters long.').optional().or(z.literal('')),

  imagePath: z.string().nullable().optional(),
});

export const updateExerciseSchema = registerExerciseSchema.partial().refine((data) => Object.keys(data).length > 0, 'At least one field must be provided for an update.');

export type RegisterExericseDto = z.infer<typeof registerExerciseSchema>;

export type UpdateExericseDto = z.infer<typeof updateExerciseSchema>;
