'use client';

// React
import { useState, useEffect } from 'react';

// Styles
import FormStyles from '@/components/form.module.css';

// Services
import WorkoutService from '@/services/workout-service';

// ViewModels
import type { ExerciseViewModel } from '@/view-models/excercise-view-model';

interface WorkoutExercise {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  note: string;
}

interface RegisterWorkoutFormData {
  name: string;
  description: string;
  workoutExercises: WorkoutExercise[];
}

export default function AddWorkoutForm() {
  const [exercises, setExercises] = useState<ExerciseViewModel[]>([]);

  const [formData, setFormData] = useState<RegisterWorkoutFormData>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const workout = await WorkoutService.create(formData);
    } catch (error) {
      console.error(error);
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
          rest: 0,
          note: '',
        },
      ],
    }));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: number | string) => {
    const updatedExercises = [...formData.workoutExercises];

    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      workoutExercises: updatedExercises,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Lägg till <span>Workout</span>
        </h1>
      </div>

      {/* Workout name */}
      <div className={FormStyles.formGroup}>
        <label htmlFor="name" className={FormStyles.formLabel}>
          Workout namn *
        </label>

        <input
          className={FormStyles.formInput}
          id="name"
          type="text"
          placeholder="T.ex. Push Day"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
      </div>

      {/* Description */}
      <div className={FormStyles.formGroup}>
        <label htmlFor="description" className={FormStyles.formLabel}>
          Beskrivning
        </label>

        <textarea
          className={FormStyles.formTextarea}
          id="description"
          rows={4}
          placeholder="Beskriv workouten..."
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />
      </div>

      {/* Exercises */}
      <div className={FormStyles.exerciseSection}>
        <h2 className={FormStyles.sectionTitle}>Övningar</h2>

        {formData.workoutExercises.map((exercise, index) => (
          <div key={index} className={FormStyles.exerciseCard}>
            <div className={FormStyles.formGroup}>
              <label htmlFor={`exercise-${index}`} className={FormStyles.formLabel}>
                Övning
              </label>

              <select
                id={`exercise-${index}`}
                className={FormStyles.formSelect}
                value={exercise.exerciseId}
                onChange={(e) => updateExercise(index, 'exerciseId', Number(e.target.value))}
              >
                <option value={0} disabled>
                  Välj övning
                </option>

                {exercises.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={FormStyles.exerciseGrid}>
              <div className={FormStyles.formGroup}>
                <label htmlFor={`sets-${index}`} className={FormStyles.formLabel}>
                  Set
                </label>

                <input
                  id={`sets-${index}`}
                  type="number"
                  min={1}
                  className={FormStyles.formInput}
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', Number(e.target.value))}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor={`reps-${index}`} className={FormStyles.formLabel}>
                  Reps
                </label>

                <input
                  id={`reps-${index}`}
                  type="number"
                  min={1}
                  className={FormStyles.formInput}
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', Number(e.target.value))}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor={`weight-${index}`} className={FormStyles.formLabel}>
                  Vikt (kg)
                </label>

                <input
                  id={`weight-${index}`}
                  type="number"
                  step="0.5"
                  className={FormStyles.formInput}
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', Number(e.target.value))}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor={`rest-${index}`} className={FormStyles.formLabel}>
                  Vila (sek)
                </label>

                <input
                  id={`rest-${index}`}
                  type="number"
                  className={FormStyles.formInput}
                  value={exercise.rest}
                  onChange={(e) => updateExercise(index, 'rest', Number(e.target.value))}
                />
              </div>
            </div>

            <div className={FormStyles.formGroup}>
              <label htmlFor={`note-${index}`} className={FormStyles.formLabel}>
                Anteckning
              </label>

              <textarea
                id={`note-${index}`}
                rows={3}
                className={FormStyles.formTextarea}
                value={exercise.note}
                onChange={(e) => updateExercise(index, 'note', e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="button" className={FormStyles.addExerciseButton} onClick={addExercise}>
          + Lägg till övning
        </button>
      </div>

      <button type="submit" className={FormStyles.submitButton}>
        Spara Workout
      </button>
    </form>
  );
}
