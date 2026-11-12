import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const workoutIdSchema = z.number().int().positive({
  message: 'Workout ID must be greater than 0.',
});

const isTodayOrFuture = (date: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(`${date}T00:00:00`);

  return !Number.isNaN(inputDate.getTime()) && inputDate >= today;
};

const futureOrTodayDateSchema = z.string().min(1, 'Date is required.').refine(isTodayOrFuture, {
  message: 'Date cannot be in the past.',
});

// --------------------------------------------------
// Schedule workout schema
// --------------------------------------------------

export const schedelueWorkoutSchema = z.object({
  workoutId: workoutIdSchema,
  date: futureOrTodayDateSchema,
});

// --------------------------------------------------
// Create workout schedule schema
// --------------------------------------------------

export const createWorkoutScheduleSchema = z.object({
  workoutId: workoutIdSchema,
  date: futureOrTodayDateSchema,
});

// --------------------------------------------------
// Calendar month schema
// --------------------------------------------------

export const calendarMonthSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

// --------------------------------------------------
// DTOs
// --------------------------------------------------

export type SchedelueWorkoutDto = z.infer<typeof schedelueWorkoutSchema>;
