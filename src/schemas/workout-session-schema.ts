import { z } from 'zod';

export const createWorkoutSessionSchema = z.object({
  workoutId: z.number().int().positive(),
  workoutScheduleId: z.number().int().positive().optional(),
});

export const updateWorkoutSessionSetSchema = z.object({
  actualReps: z.number().int().finite().min(0),
  actualWeight: z.number().finite().min(0),
  actualSeconds: z.number().finite().min(0),
});

export const workoutSessionIdSchema = z.number().int().positive();

export const workoutSessionSetIdSchema = z.number().int().positive();
