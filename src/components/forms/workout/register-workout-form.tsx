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
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormTextarea from '@/components/ui/form-textarea';

type Props = {
  exericses: ExerciseViewModel[];
};

export default function AddWorkoutForm({ exericses }: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<AddWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const validation = registerWorkoutSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }

    setIsSaving(true);

    try {
      const response = await registerWorkoutAction(validation.data);

      if (!response.success) {
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));
        toast.error(response.message);
        return;
      }

      toast.success(response.message ?? 'Workout was successfully created.');
      router.push('/workout');
    } catch (error) {
      console.error('Failed to create workout:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
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
          seconds: 0,
          note: '',
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

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Add <span>Workout</span>
      </h1>

      <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor="name" label="Workout name" required error={errors.name?.[0]}>
            <FormInput
              required
              id="name"
              name="name"
              type="text"
              placeholder="Example. Push Day"
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
          <FormField htmlFor="description" label="Description" error={errors.description?.[0]}>
            <FormTextarea
              id="description"
              name="description"
              rows={4}
              placeholder="Example. Focus on arms, chest..."
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
          <h2 className={FormStyles.sectionTitle}>Exercises</h2>

          {formData.workoutExercises.map((exercise, index) => (
            <WorkoutExerciseCard key={index} index={index} exercise={exercise} exercises={exericses} onUpdate={updateExercise} onRemove={removeExercise} />
          ))}

          <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise} disabled={isSaving}>
            + Add more exercises
          </button>
        </div>

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
