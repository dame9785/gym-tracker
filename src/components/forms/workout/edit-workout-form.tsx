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
import WorkoutService from '@/services/workout-service';
import { toast } from 'sonner';

//Components
import EditWorkoutExericeCard from '@/components/forms/workout/edit-workout-exericse-card';

//NEXT Redirect

import { UpdateWorkoutDto, UpdateWorkoutExericseDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';

//Props
type props = {
  workout: WorkoutViewModel;
  exericses: ExerciseViewModel[];
};

export default function EditWorkoutForm({ workout, exericses }: props) {
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateWorkoutDto, string>>>({});
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateWorkoutDto>({
    name: workout.name,
    description: workout.description ?? '',
    workoutExercises: workout.workoutExercises,
  });

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: [
        ...prev.workoutExercises,
        {
          exerciseId: 0,
          name: '',
          sets: 0,
          reps: 0,
          order: 0,
          weight: 0,
          note: '',
        },
      ],
    }));
  };

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

  //Handle Sumbit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = updateWorkoutSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateWorkoutDto>(validation.error.issues));
      return;
    }

    try {
      const response = await WorkoutService.update(Number(workout.id), validation.data);
      if (!response.success) {
        toast.error('Träningspass tillagt');
        return;
      }
    } catch (error) {
      toast.error('Något gick fel, gick inte uppdatera träningspasset');
      return;
    } finally {
      router.push('/workout');
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

        <button type="submit" className={FormStyles.submitButton}>
          Spara Workout
        </button>
      </form>
    </div>
  );
}
