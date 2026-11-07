
import { z } from 'zod';

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

const updateWorkoutExerciseSchema = z.object({
  exerciseId: requiredInteger
    .pipe(z.number().positive('Ogiltigt övnings-ID.')),

  sets: requiredInteger
    .pipe(z.number().min(0, 'Antal set kan inte vara negativt.')),

  reps: requiredInteger
    .pipe(z.number().min(0, 'Antal repetitioner kan inte vara negativt.')),

  weight: requiredNumber
    .pipe(z.number().min(0, 'Vikten kan inte vara negativ.')),

  seconds: requiredInteger
    .pipe(z.number().min(0, 'Sekunder kan inte vara negativa.')),

  note: z.string()
    .trim()
    .max(500, 'Anteckningen får innehålla högst 500 tecken.'),
});

export const updateWorkoutSchema = z.object(workoutFields);

export const registerWorkoutSchema = z.object(workoutFields);

export type UpdateWorkoutDto = z.infer<typeof updateWorkoutSchema>;

export type UpdateWorkoutExerciseDto = z.infer<
  typeof updateWorkoutExerciseSchema
>;

export type AddWorkoutDto = z.infer<typeof registerWorkoutSchema>;
