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
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormTextarea from '@/components/ui/form-textarea';

type Props = {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
};

export default function EditWorkoutForm({ workout, exericses }: Props) {
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

  const updateExercise = (index: number, field: keyof UpdateWorkoutDto['workoutExercises'][number], value: number | string) => {
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

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: prev.workoutExercises.filter((_, i) => i !== index),
    }));
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
          seconds: 0,
          note: '',
        },
      ],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateWorkoutAction(workout.id, formData);

      if (!response.success) {
        if (response.errors) {
          setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));
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

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Uppdatera <span>träningspass</span>
      </h1>

      <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor="name" label="Workout namn" required error={errors.name?.[0]}>
            <FormInput
              required
              id="name"
              name="name"
              type="text"
              placeholder="T.ex. Push Day"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              disabled={isSaving}
              aria-invalid={!!errors.name?.length}
            />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor="description" label="Beskrivning" error={errors.description?.[0]}>
            <FormTextarea
              id="description"
              name="description"
              rows={4}
              placeholder="Fokusera på axlar, bröst..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={isSaving}
              aria-invalid={!!errors.description?.length}
            />
          </FormField>
        </div>

        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>Övningar</h2>

          {formData.workoutExercises.map((workoutExercise, index) => (
            <EditWorkoutExericeCard key={index} index={index} workoutExericse={workoutExercise} exercises={exericses} onUpdate={updateExercise} onRemove={removeExercise} />
          ))}

          <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise} disabled={isSaving}>
            + Lägg till övning
          </button>
        </div>

        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Updating workout...' : 'Update workout'}
        </Button>
      </form>
    </div>
  );
}
