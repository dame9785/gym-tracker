'use client';

// Next & Hooks
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Styles
import FormStyles from '@/components/forms/form.module.css';

// Components
import WorkoutExerciseCard from '@/components/forms/workout/workout-exercise-card';

//Helpers
import { hasDuplicateExercises } from '@/helpers/check-dupplicate-exericse-helper';

//Types
import type { RegisterWorkoutDto } from '@/types/workout-types';
import type { ExerciseViewModel, RegisterWorkoutExerciseDto } from '@/types/exercise-types';

//Toast alert sonner
import { toast } from 'sonner';
import { registerWorkoutSchema } from '@/schemas/workout-schemas';

import { registerWorkoutAction } from '@/actions/workout-actions';

type Props = {
  exericses: ExerciseViewModel[];
};

export default function AddWorkoutForm({ exericses }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<RegisterWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Validate data with ZOD
    const validate = registerWorkoutSchema.safeParse(formData);

    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }

    // Check duplicate exercises
    if (hasDuplicateExercises(formData.workoutExercises)) {
      toast.error('You cannot choose the same exercise more than once.');
      return;
    }

    try {
      const response = await registerWorkoutAction(validate.data);

      if (!response.success) {
        setErrors(response.errors ?? {});
        toast.error(response.message);
        return;
      }

      toast.success(response.message ?? 'Workout was successfully created.');
      router.push('/workout');
    } catch (error) {
      console.error('Failed to create workout:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: [
        ...prev.workoutExercises,
        {
          exerciseId: 0,
          sets: 0,
          reps: 0,
          weight: 0,
          note: '',
          seconds: 0,
        },
      ],
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: prev.workoutExercises.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (index: number, field: keyof RegisterWorkoutExerciseDto, value: number | string) => {
    setFormData((prev) => {
      const updatedExercises = [...prev.workoutExercises];

      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value,
      };

      return {
        ...prev,
        workoutExercises: updatedExercises,
      };
    });
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Add <span>Workout</span>
      </h1>

      <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
        {/* Workout namn */}
        <div className={FormStyles.formGroup}>
          <label htmlFor="name" className={FormStyles.formLabel}>
            Workout name *
          </label>

          <input
            id="name"
            type="text"
            className={FormStyles.formInput}
            placeholder="Example. Push Day"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          {errors.name?.[0] && (
            <p id="name-error" className="text-red-500" role="alert">
              {errors.name[0]}
            </p>
          )}
        </div>

        {/* Beskrivning */}
        <div className={FormStyles.formGroup}>
          <label htmlFor="description" className={FormStyles.formLabel}>
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            className={FormStyles.formTextarea}
            placeholder="Example. Focus on arms, breast..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          {errors.description?.[0] && (
            <p id="description-error" className="text-red-500" role="alert">
              {errors.description[0]}
            </p>
          )}
        </div>

        {/* Övningar */}
        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>Exericses</h2>

          {formData.workoutExercises.map((exercise, index) => (
            <WorkoutExerciseCard key={index} index={index} exercise={exercise} exercises={exericses} onUpdate={updateExercise} onRemove={removeExercise} />
          ))}

          <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise}>
            + Add more exericse
          </button>
        </div>

        <button type="submit" className={FormStyles.submitButton}>
          Save Workout
        </button>
      </form>
    </div>
  );
}
