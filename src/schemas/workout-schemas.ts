import { z } from 'zod';

export const updateWorkoutExericeSchema = z.object({
  exerciseId: z.number(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number(),
  note: z.string().trim().min(1, 'Anteckning måste anges.'),
});

export const updateWorkoutSchema = z.object({
  description: z.string().trim().min(1, 'Anteckning måste anges.'),
  name: z.string().trim().min(1, 'Namnet måste anges.'),
  workoutExercises: z.array(updateWorkoutExericeSchema),
});

export const registerWorkoutSchema = z.object({
  description: z.string().trim().min(1, 'Beskrivning måste anges.'),
  name: z.string().trim().min(1, 'Namn måste anges.'),
  workoutExercises: z.array(updateWorkoutExericeSchema),
});

export type UpdateWorkoutDto = z.infer<typeof updateWorkoutSchema>;
export type UpdateWorkoutExericseDto = z.infer<typeof updateWorkoutExericeSchema>;
export type AddWorkoutDto = z.infer<typeof registerWorkoutSchema>;
