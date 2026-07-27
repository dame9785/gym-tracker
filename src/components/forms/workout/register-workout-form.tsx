'use client';

// React
import { useEffect, useState } from 'react';

// Next
import { useRouter } from 'next/navigation';

// Styles
import FormStyles from '@/components/forms/form.module.css';

// Components
import WorkoutExerciseCard from '@/components/forms/workout/workout-exercise-card';

// Services
import WorkoutService from '@/services/workout-service';

// DTOs
import type { RegisterWorkoutDto, RegisterWorkoutExerciseDto } from '@/dto/register-workout-dto';

// ViewModels
import type ExerciseViewModel from '@/view-models/excercise-view-model';

import { toast } from 'sonner';

export default function AddWorkoutForm() {
  const router = useRouter();

  const [exercises, setExercises] = useState<ExerciseViewModel[]>([]);

  const [formData, setFormData] = useState<RegisterWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await WorkoutService.get();
      setExercises(data);
    };

    fetchExercises();
  }, []);

  const validateFormData = () => {
    if (formData.name.trim() === '') {
      toast.error('Workout namn måste fyllas i.');
      return false;
    }

    if (formData.description.trim() === '') {
      toast.error('Beskrivning måste fyllas i.');
      return false;
    }

    if (formData.workoutExercises.length === 0) {
      toast.error('Du måste lägga till minst en övning.');
      return false;
    }

    for (const exercise of formData.workoutExercises) {
      if (exercise.exerciseId === 0) {
        toast.error('Välj en övning.');
        return false;
      }

      if (exercise.sets < 1) {
        toast.error('Set måste vara minst 1.');
        return false;
      }

      if (exercise.reps < 1) {
        toast.error('Reps måste vara minst 1.');
        return false;
      }

      if (exercise.weight < 0) {
        toast.error('Vikten kan inte vara negativ.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Validate form data.
    if (!validateFormData()) {
      return;
    }

    try {
      const result = await WorkoutService.create(formData);
      if (!result.success) {
        toast.error('Något gick fel, kunde inte skapa');
        return;
      }

      toast.success('Träningspass tillagt');
      router.push('/workout');
    } catch (error) {
      toast.error('Något är fel, övning ej skapad');
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

  const updateExercise = (
    index: number,
    field: keyof RegisterWorkoutExerciseDto,
    value: number | string,
  ) => {
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
        Lägg till <span>träningspass</span>
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
        </div>

        {/* Övningar */}
        <div className={FormStyles.exerciseSection}>
          <h2 className={FormStyles.sectionTitle}>Övningar</h2>

          {formData.workoutExercises.map((exercise, index) => (
            <WorkoutExerciseCard
              key={index}
              index={index}
              exercise={exercise}
              exercises={exercises}
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
