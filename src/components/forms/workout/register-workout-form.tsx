'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';

import FormStyles from '@/components/forms/form.module.css';

import WorkoutExerciseCard from '@/components/forms/workout/workout-exercise-card';

import { toast } from 'sonner';

import type { ExerciseViewModel } from '@/types/exercise-types';

import { registerWorkoutSchema, type AddWorkoutDto } from '@/schemas/workout-schemas';

import { registerWorkoutAction } from '@/actions/workout-actions';
import Button from '@/components/button/button';

// --------------------------------------------------
// Props
// --------------------------------------------------

type Props = {
  exericses: ExerciseViewModel[];
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function AddWorkoutForm({ exericses }: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<AddWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const validation = registerWorkoutSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors as Record<string, string[]>);

      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await registerWorkoutAction(validation.data);

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

  // --------------------------------------------------
  // Add exercise
  // --------------------------------------------------

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
          seconds: 0,
          note: '',
        },
      ],
    }));
  };

  // --------------------------------------------------
  // Remove exercise
  // --------------------------------------------------

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: prev.workoutExercises.filter((_, i) => i !== index),
    }));
  };

  // --------------------------------------------------
  // Update exercise
  // --------------------------------------------------

  const updateExercise = (index: number, field: keyof AddWorkoutDto['workoutExercises'][number], value: number | string) => {
    setFormData((prev) => {
      const updatedExercises = [...prev.workoutExercises];
      const current = updatedExercises[index];

      if (!current) {
        return prev;
      }

      updatedExercises[index] = {
        ...current,
        [field]: value,
      } as AddWorkoutDto['workoutExercises'][number];

      return {
        ...prev,
        workoutExercises: updatedExercises,
      };
    });
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Add <span>Workout</span>
      </h1>

      <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
        {/* Workout name */}

        <div className={FormStyles.formGroup}>
          <label htmlFor="name" className={FormStyles.formLabel}>
            Workout name *
          </label>

          <input
            required
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

          {errors.name?.map((error, index) => (
            <p key={index} id="name-error" className="text-red-500" role="alert">
              {error}
            </p>
          ))}
        </div>

        {/* Description */}

        <div className={FormStyles.formGroup}>
          <label htmlFor="description" className={FormStyles.formLabel}>
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            className={FormStyles.formTextarea}
            placeholder="Example. Focus on arms, chest..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          {errors.description?.map((error, index) => (
            <p key={index} id="description-error" className="text-red-500" role="alert">
              {error}
            </p>
          ))}
        </div>

        {/* Exercises */}

        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>Exercises</h2>

          {formData.workoutExercises.map((exercise, index) => (
            <WorkoutExerciseCard key={index} index={index} exercise={exercise} exercises={exericses} onUpdate={updateExercise} onRemove={removeExercise} />
          ))}

          <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise}>
            + Add more exercises
          </button>
        </div>

        {/* Submit button */}
        <div className="flex gap-2">
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" size="md" loading={isSaving}>
              Save Workout
            </Button>

            <Button href="/log-weight" variant="secondary" size="md">
              Gå tillbaka
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
