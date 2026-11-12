import { z } from 'zod';

export const schedelueWorkoutSchema = z.object({
  workoutId: z.number().min(1, {
    message: 'Workout ID måste vara större än 0',
  }),

  date: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today;
    },
    {
      message: 'Datumet har passerat',
    },
  ),
});

export const createWorkoutScheduleSchema = z.object({
  workoutId: z.number().int().positive(),
  date: z.string().min(1),
});

export const calendarMonthSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

export type SchedelueWorkoutDto = z.infer<typeof schedelueWorkoutSchema>;
