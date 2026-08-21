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

export type SchedelueWorkoutDto = z.infer<typeof schedelueWorkoutSchema>;
