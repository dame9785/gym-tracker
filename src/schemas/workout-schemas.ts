import { z } from 'zod';

// --------------------------------------------------
// Shared number validation
// --------------------------------------------------

const requiredNumber = z.preprocess((value) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (typeof value !== 'string' && typeof value !== 'number')) {
    return Number.NaN;
  }

  return value;
}, z.coerce.number().finite('Value must be a valid number.'));

const requiredInteger = requiredNumber.pipe(z.number().int());

// --------------------------------------------------
// Workout exercise schema
// --------------------------------------------------

const updateWorkoutExerciseSchema = z.object({
  exerciseId: requiredInteger.pipe(z.number().positive('Invalid exercise ID.')),

  sets: requiredInteger.pipe(z.number().min(0, 'Number of sets cannot be negative.')),

  reps: requiredInteger.pipe(z.number().min(0, 'Number of repetitions cannot be negative.')),

  weight: requiredNumber.pipe(z.number().min(0, 'Weight cannot be negative.')),

  seconds: requiredInteger.pipe(z.number().min(0, 'Duration cannot be negative.')),

  note: z.string().trim().max(500, 'Note cannot exceed 500 characters.'),
});

// --------------------------------------------------
// Shared workout fields
// --------------------------------------------------

const workoutFields = {
  name: z.string().trim().min(1, 'Workout name is required.').max(100, 'Workout name cannot exceed 100 characters.'),

  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters.'),

  workoutExercises: z.array(updateWorkoutExerciseSchema).superRefine((exercises, ctx) => {
    const seenExerciseIds = new Set<number>();

    exercises.forEach((exercise, index) => {
      if (seenExerciseIds.has(exercise.exerciseId)) {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'exerciseId'],
          message: 'The same exercise cannot be added more than once.',
        });
      }

      seenExerciseIds.add(exercise.exerciseId);
    });
  }),
} satisfies z.ZodRawShape;

// --------------------------------------------------
// Workout schemas
// --------------------------------------------------

export const updateWorkoutSchema = z.object(workoutFields);

export const registerWorkoutSchema = z.object(workoutFields);

// --------------------------------------------------
// DTO types
// --------------------------------------------------

export type UpdateWorkoutDto = z.output<typeof updateWorkoutSchema>;

export type UpdateWorkoutExerciseDto = z.output<typeof updateWorkoutExerciseSchema>;

export type AddWorkoutDto = z.output<typeof registerWorkoutSchema>;
