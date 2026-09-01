'use client';

//React hooks
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//Styles
import FormStyles from '@/components/forms/form.module.css';

//Types
import type { ExerciseViewModel } from '@/types/exercise-types';
import type { WorkoutViewModel } from '@/types/workout-types';

//Services
import { toast } from 'sonner';

//Components
import EditWorkoutExericeCard from '@/components/forms/workout/edit-workout-exericse-card';

//NEXT Redirect

import { UpdateWorkoutDto, UpdateWorkoutExericseDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { updateWorkoutAction } from '@/actions/workout-actions';
import Button from '@/components/button/button';

//Props
type props = {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
};

export default function EditWorkoutForm({ workout, exericses }: props) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();
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

  const updateExercise = (index: number, field: keyof UpdateWorkoutExericseDto, value: number | string) => {
    setFormData((prev) => {
      const updated = [...prev.workoutExercises];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('1. Submit triggered');
    console.log('2. Form data:', formData);

    const validate = updateWorkoutSchema.safeParse(formData);

    if (!validate.success) {
      console.log('VALIDATION FAILED');
      console.log(validate.error.flatten().fieldErrors);
      console.log(validate.error.issues);

      setErrors(validate.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateWorkoutAction(workout.id, validate.data);

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

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Uppdatera <span>träningspass</span>
      </h1>

      <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
        {/* Workout namn */}
        <div className={FormStyles.formGroup}>
          <label htmlFor="name" className={FormStyles.formLabel}>
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
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>

        {/* Beskrivning */}
        <div className={FormStyles.formGroup}>
          <label htmlFor="description" className={FormStyles.formLabel}>
            Beskrivning
          </label>

          <textarea
            required
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
          {errors.description && <p className={FormStyles.fieldErrorMessage}>{errors.description}</p>}
        </div>

        {/* Övningar */}
        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>Övningar</h2>

          {formData.workoutExercises.map((workoutExercise, index) => (
            <EditWorkoutExericeCard
              key={index}
              index={index}
              workoutExericse={workoutExercise}
              exercises={exericses}
              onUpdate={updateExercise}
              onRemove={removeExercise}
            />
          ))}

          <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise}>
            + Lägg till övning
          </button>
        </div>

        {/* Button */}
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Updating workout...' : 'Update workout'}
        </Button>
      </form>
    </div>
  );
}
