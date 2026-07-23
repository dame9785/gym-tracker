'use client';

//React
import { useState, useEffect } from 'react';

// Styles
import FormStyles from '@/components/form.module.css';

//Services
import WorkoutService from '@/services/workoutService';

//ViewModels
import type { ExerciseViewModel } from '@/view-models/ExcerciseViewModel';

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
  note: string;
  workoutExercises: WorkoutExercise[];
}

export default function AddWorkoutForm() {
  const [exercises, setExercies] = useState<ExerciseViewModel[]>([]);

  const [formData, setFormData] = useState<RegisterWorkoutFormData>({
    name: '',
    description: '',
    note: '',
    workoutExercises: [],
  });

  //GET Execerises
  useEffect(() => {
    const fetchExercises = async () => {
      const exercises = await WorkoutService.get();
      setExercies(exercises);
    };

    fetchExercises();
  }, []);

  //Add workout
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await WorkoutService.create(formData);

      console.log('Workout sparad!');
    } catch (error) {
      console.error(error);
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      workoutExercises: [
        ...formData.workoutExercises,
        {
          exerciseId: 0,
          sets: 0,
          reps: 0,
          weight: 0,
          rest: 0,
          note: '',
        },
      ],
    });
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
    <form onSubmit={handleSumbit} className={`${FormStyles.form} mx-auto`}>
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

      {/* Workout note */}
      <div className={FormStyles.formGroup}>
        <label htmlFor="workoutNote" className={FormStyles.formLabel}>
          Notering
        </label>

        <textarea
          className={FormStyles.formTextarea}
          id="workoutNote"
          rows={4}
          placeholder="Skriv en notering..."
          value={formData.note}
          onChange={(e) =>
            setFormData({
              ...formData,
              note: e.target.value,
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
              <label htmlFor="exercise" className={FormStyles.formLabel}>
                Övning
              </label>

              <select
                id="exercise"
                className={FormStyles.formSelect}
                value={exercise.exerciseId}
                onChange={(e) => updateExercise(index, 'exerciseId', Number(e.target.value))}
              >
                <option value={0} disabled>
                  Välj övning
                </option>

                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={FormStyles.exerciseGrid}>
              <div className={FormStyles.formGroup}>
                <label htmlFor="sets" className={FormStyles.formLabel}>
                  Set
                </label>

                <input
                  id="sets"
                  type="number"
                  min={1}
                  placeholder="4"
                  className={FormStyles.formInput}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor="reps" className={FormStyles.formLabel}>
                  Reps
                </label>

                <input
                  id="reps"
                  type="number"
                  min={1}
                  placeholder="8"
                  className={FormStyles.formInput}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor="weight" className={FormStyles.formLabel}>
                  Vikt (kg)
                </label>

                <input
                  id="weight"
                  type="number"
                  step="0.5"
                  placeholder="80"
                  className={FormStyles.formInput}
                />
              </div>

              <div className={FormStyles.formGroup}>
                <label htmlFor="rest" className={FormStyles.formLabel}>
                  Vila (sek)
                </label>

                <input id="rest" type="number" placeholder="90" className={FormStyles.formInput} />
              </div>
            </div>

            <div className={FormStyles.formGroup}>
              <label htmlFor="exerciseNote" className={FormStyles.formLabel}>
                Anteckning
              </label>

              <textarea
                id="exerciseNote"
                rows={3}
                placeholder="Anteckning om övningen..."
                className={FormStyles.formTextarea}
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
