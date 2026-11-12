import { z } from 'zod';

// --------------------------------------------------
// Shared validation
// --------------------------------------------------

const positiveIdSchema = z.number().int().positive();

const nonNegativeNumberSchema = z.number().finite().min(0);

const nonNegativeIntegerSchema = z.number().int().finite().min(0);

// --------------------------------------------------
// Create workout session
// --------------------------------------------------

export const createWorkoutSessionSchema = z.object({
  workoutId: positiveIdSchema,
  workoutScheduleId: positiveIdSchema.optional(),
});

// --------------------------------------------------
// Update workout session set
// --------------------------------------------------

export const updateWorkoutSessionSetSchema = z.object({
  actualReps: nonNegativeIntegerSchema,
  actualWeight: nonNegativeNumberSchema,
  actualSeconds: nonNegativeNumberSchema,
});

// --------------------------------------------------
// IDs
// --------------------------------------------------

export const workoutSessionIdSchema = positiveIdSchema;

export const workoutSessionSetIdSchema = positiveIdSchema;
