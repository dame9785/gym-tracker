'use client';

// Next & Hooks
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Styles
import FormStyles from '@/components/forms/form.module.css';

// Components
import WorkoutExerciseCard from '@/components/forms/workout/workout-exercise-card';

// Services
import WorkoutService from '@/services/workout-service';

//Helpers
import { hasDuplicateExercises } from '@/helpers/check-dupplicate-exericse-helper';

//Types
import type { RegisterWorkoutDto } from '@/types/workout-types';
import type { ExerciseViewModel, RegisterWorkoutExerciseDto } from '@/types/exercise-types';

//Toast alert sonner
import { toast } from 'sonner';
import { AddWorkoutDto, registerWorkoutSchema } from '@/schemas/workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  exericses: ExerciseViewModel[];
  userToken: string;
};

export default function AddWorkoutForm({ exericses, userToken }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof AddWorkoutDto, string>>>({});
  const [formData, setFormData] = useState<RegisterWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = registerWorkoutSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<AddWorkoutDto>(validation.error.issues));
      return;
    }

    //Check duplicate exericses
    if (hasDuplicateExercises(formData.workoutExercises)) {
      toast.error('You cannot choose the same exercise more than once.');
      return false;
    }

    try {
      const response = await WorkoutService.create(formData, userToken);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
    } catch (error) {
      console.error('Failed to create exericse:', error);
      toast.error('Something went wrong. Please try again.');
      return;
    } finally {
      toast.success('Workout was successfully created');
      router.push('/workout');
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
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
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
          {errors.description && <p className={FormStyles.fieldErrorMessage}>{errors.description}</p>}
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
