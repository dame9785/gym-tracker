
import { z } from 'zod';

// --------------------------------------------------
// Shared number validation
// --------------------------------------------------

const requiredNumber = z.preprocess(
  (value) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return Number.NaN;
    }

    return value;
  },
  z.coerce.number().finite()
);

const requiredInteger = requiredNumber.pipe(
  z.number().int()
);

// --------------------------------------------------
// Workout exercise schema
// --------------------------------------------------

export const updateWorkoutExerciseSchema = z.object({
  exerciseId: requiredInteger.pipe(
    z.number().positive('Ogiltigt övnings-ID.')
  ),

  sets: requiredInteger.pipe(
    z.number().min(0, 'Antal set kan inte vara negativt.')
  ),

  reps: requiredInteger.pipe(
    z.number().min(0, 'Antal repetitioner kan inte vara negativt.')
  ),

  weight: requiredNumber.pipe(
    z.number().min(0, 'Vikten kan inte vara negativ.')
  ),

  seconds: requiredInteger.pipe(
    z.number().min(0, 'Sekunder kan inte vara negativa.')
  ),

  note: z.string()
    .trim()
    .max(500, 'Anteckningen får innehålla högst 500 tecken.'),
});

// --------------------------------------------------
// Shared workout fields
// --------------------------------------------------

const workoutFields = {
  name: z.string()
    .trim()
    .min(1, 'Workout name is required.')
    .max(100, 'Workout name cannot exceed 100 characters.'),

  description: z.string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters.'),

  workoutExercises: z.array(updateWorkoutExerciseSchema),
} satisfies z.ZodRawShape;

// --------------------------------------------------
// Workout schemas
// --------------------------------------------------

export const updateWorkoutSchema = z.object(workoutFields);

export const registerWorkoutSchema = z.object(workoutFields);

// --------------------------------------------------
// DTO types
// --------------------------------------------------

export type UpdateWorkoutDto = z.output<
  typeof updateWorkoutSchema
>;

export type UpdateWorkoutExerciseDto = z.output<
  typeof updateWorkoutExerciseSchema
>;

export type AddWorkoutDto = z.output<
  typeof registerWorkoutSchema
>;
