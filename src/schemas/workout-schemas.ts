
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

const updateWorkoutExerciseSchema = z.object({
  exerciseId: requiredNumber
    .int('Övningens ID måste vara ett heltal.')
    .positive('Ogiltigt övnings-ID.'),

  sets: requiredNumber
    .int('Antal set måste vara ett heltal.')
    .min(0, 'Antal set kan inte vara negativt.'),

  reps: requiredNumber
    .int('Antal repetitioner måste vara ett heltal.')
    .min(0, 'Antal repetitioner kan inte vara negativt.'),

  weight: requiredNumber
    .min(0, 'Vikten kan inte vara negativ.'),

  seconds: requiredNumber
    .int('Sekunder måste vara ett heltal.')
    .min(0, 'Sekunder kan inte vara negativa.'),

  note: z.string()
    .trim()
    .max(500, 'Anteckningen får innehålla högst 500 tecken.'),
});

const workoutFields = {
  description: z.string()
    .trim()
    .min(1, 'Beskrivning måste anges.')
    .max(1000, 'Beskrivningen får innehålla högst 1000 tecken.'),

  name: z.string()
    .trim()
    .min(1, 'Namnet måste anges.')
    .max(100, 'Namnet får innehålla högst 100 tecken.'),

  workoutExercises: z
  .array(updateWorkoutExerciseSchema)
  .min(1, 'Minst en övning måste läggas till.')
  .superRefine((exercises, ctx) => {
    const exerciseIds = exercises.map((exercise) => exercise.exerciseId);

    if (new Set(exerciseIds).size !== exerciseIds.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Samma övning kan inte läggas till flera gånger.',
      });
    }
  }),
};

export const updateWorkoutSchema = z.object(workoutFields);

export const registerWorkoutSchema = z.object(workoutFields);

export type UpdateWorkoutDto = z.infer<typeof updateWorkoutSchema>;

export type UpdateWorkoutExerciseDto = z.infer<
  typeof updateWorkoutExerciseSchema
>;

export type AddWorkoutDto = z.infer<typeof registerWorkoutSchema>;
