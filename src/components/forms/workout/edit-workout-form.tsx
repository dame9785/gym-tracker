
'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import FormStyles from '@/components/forms/form.module.css';

import type { ExerciseViewModel } from '@/types/exercise-types';
import type { WorkoutViewModel } from '@/types/workout-types';

import { toast } from 'sonner';

import EditWorkoutExericeCard from '@/components/forms/workout/edit-workout-exericse-card';

import type { UpdateWorkoutDto } from '@/schemas/workout-schemas';

import { updateWorkoutAction } from '@/actions/workout-actions';

import Button from '@/components/button/button';

// --------------------------------------------------
// Props
// --------------------------------------------------

type Props = {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function EditWorkoutForm({
  workout,
  exericses,
}: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateWorkoutDto>({
    name: workout.name,
    description: workout.description ?? '',
    workoutExercises: workout.workoutExercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      seconds: exercise.seconds,
      note: exercise.note ?? '',
    })),
  });

  // --------------------------------------------------
  // Update exercise
  // --------------------------------------------------

  const updateExercise = (
    index: number,
    field: keyof UpdateWorkoutDto['workoutExercises'][number],
    value: number | string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.workoutExercises];
      const current = updated[index];

      if (!current) {
        return prev;
      }

      updated[index] = {
        ...current,
        [field]: value,
      } as UpdateWorkoutDto['workoutExercises'][number];

      return {
        ...prev,
        workoutExercises: updated,
      };
    });
  };

  // --------------------------------------------------
  // Remove exercise
  // --------------------------------------------------

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: prev.workoutExercises.filter(
        (_, i) => i !== index
      ),
    }));
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
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateWorkoutAction(
        workout.id,
        formData
      );

      if (!response.success) {
        if (response.errors) {
          setErrors(response.errors);
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/workout');
    } catch (error) {
      console.error('Failed to update workout:', error);

      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Uppdatera <span>träningspass</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className={`${FormStyles.form} mx-auto`}
      >
        {/* Workout name */}

        <div className={FormStyles.formGroup}>
          <label
            htmlFor="name"
            className={FormStyles.formLabel}
          >
            Workout namn *
          </label>

          <input
            required
            id="name"
            type="text"
            className={FormStyles.formInput}
            placeholder="T.ex. Push Day"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          {errors.name?.map((error, index) => (
            <p
              key={index}
              className={FormStyles.fieldErrorMessage}
            >
              {error}
            </p>
          ))}
        </div>

        {/* Description */}

        <div className={FormStyles.formGroup}>
          <label
            htmlFor="description"
            className={FormStyles.formLabel}
          >
            Beskrivning
          </label>

          <textarea
            id="description"
            rows={4}
            className={FormStyles.formTextarea}
            placeholder="Fokusera på axlar, bröst..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          {errors.description?.map((error, index) => (
            <p
              key={index}
              className={FormStyles.fieldErrorMessage}
            >
              {error}
            </p>
          ))}
        </div>

        {/* Exercises */}

        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>
            Övningar
          </h2>

          {formData.workoutExercises.map(
            (workoutExercise, index) => (
              <EditWorkoutExericeCard
                key={index}
                index={index}
                workoutExericse={workoutExercise}
                exercises={exericses}
                onUpdate={updateExercise}
                onRemove={removeExercise}
              />
            )
          )}

          <button
            type="button"
            className={FormStyles.addExerciseButton}
            onClick={addExercise}
          >
            + Lägg till övning
          </button>
        </div>

        {/* Submit button */}

        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
        >
          {isSaving ? 'Updating workout...' : 'Update workout'}
        </Button>
      </form>
    </div>
  );
}
