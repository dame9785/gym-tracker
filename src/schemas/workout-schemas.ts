import { z } from 'zod';

export const updateWorkoutExericeSchema = z.object({
  exerciseId: z.number(),
  name: z.string().trim().min(1, 'Namnet måste anges.'),
  sets: z.number(),
  reps: z.number(),
  order: z.number(),
  weight: z.number(),
  note: z.string().trim().min(1, 'Anteckning måste anges.'),
});

export const updateWorkoutSchema = z.object({
  description: z.string().trim().min(1, 'Anteckning måste anges.'),
  name: z.string().trim().min(1, 'Namnet måste anges.'),
  workoutExercises: z.array(updateWorkoutExericeSchema),
});

export type UpdateWorkoutDto = z.infer<typeof updateWorkoutSchema>;
export type UpdateWorkoutExericseDto = z.infer<typeof updateWorkoutExericeSchema>;
