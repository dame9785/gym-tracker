import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const muscleNameSchema = z.string().trim().min(2, 'Muscle group must be at least 2 characters long.').max(50, 'Muscle group can be maximum 50 characters long.');

const optionalTextSchema = (maxLength: number, message: string) => z.string().trim().max(maxLength, message).optional().or(z.literal(''));

// --------------------------------------------------
// Exercise base schema
// --------------------------------------------------

const exerciseBaseSchema = z.object({
  name: z.string().trim().min(3, 'The name must be at least 3 characters.').max(50, 'Names can be maximum 50 characters long.'),

  primaryMuscle: muscleNameSchema,

  secondaryMuscles: z
    .array(muscleNameSchema)
    .default([])
    .refine((muscles) => new Set(muscles.map((muscle) => muscle.toLowerCase())).size === muscles.length, 'Secondary muscle groups cannot contain duplicates.'),

  equipment: optionalTextSchema(50, 'Equipment can be maximum 50 characters long.'),

  description: z.string().trim().min(10, 'Description must be at least 10 characters long.').max(2000, 'Description can be maximum 2000 characters long.'),

  instructions: z.string().trim().min(10, 'Instructions must be at least 10 characters long.').max(4000, 'Instructions can be maximum 4000 characters long.'),

  techniqueTips: optionalTextSchema(2000, 'Technique tips can be maximum 2000 characters long.'),

  imagePath: z.string().nullable().optional(),
});

// --------------------------------------------------
// Register exercise schema
// --------------------------------------------------

export const registerExerciseSchema = exerciseBaseSchema.superRefine((data, ctx) => {
  const primaryMuscle = data.primaryMuscle.toLowerCase();

  const duplicatePrimaryMuscle = data.secondaryMuscles.some((muscle) => muscle.toLowerCase() === primaryMuscle);

  if (duplicatePrimaryMuscle) {
    ctx.addIssue({
      code: 'custom',
      path: ['secondaryMuscles'],
      message: 'Primary muscle cannot also be a secondary muscle.',
    });
  }
});

// --------------------------------------------------
// Update exercise schema
// --------------------------------------------------

export const updateExerciseSchema = exerciseBaseSchema.partial().superRefine((data, ctx) => {
  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'At least one field must be provided for an update.',
    });
  }

  if (data.primaryMuscle && data.secondaryMuscles?.some((muscle) => muscle.toLowerCase() === data.primaryMuscle!.toLowerCase())) {
    ctx.addIssue({
      code: 'custom',
      path: ['secondaryMuscles'],
      message: 'Primary muscle cannot also be a secondary muscle.',
    });
  }
});

// --------------------------------------------------
// DTOs
// --------------------------------------------------

export type RegisterExericseDto = z.infer<typeof registerExerciseSchema>;

export type UpdateExericseDto = z.infer<typeof updateExerciseSchema>;
