'use client';

//React hooks
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//Styles
import FormStyles from '@/components/forms/form.module.css';

import type ExerciseViewModel from '@/view-models/excercise-view-model';

import ExerciseService from '@/services/exercise-service';

//Helpers
import { hasDuplicateExercises } from '@/helpers/check-dupplicate-exericse-helper';
import { validateWorkoutHelper } from '@/helpers/validation-workout-helper';

//DTO:S
import type { EditWorkoutDto, EditWorkoutExerciseDto } from '@/dto/edit-workout-dto';

//Services
import WorkoutService from '@/services/workout-service';
import { toast } from 'sonner';
import { EditWorkoutViewModel } from '@/view-models/workout-edit-view-model';

import EditWorkoutExericeCard from '@/components/forms/workout/edit-workout-exericse-card';

type pageProps = {
  workoutId: string;
};

export default function EditWorkoutForm({ workoutId }: pageProps) {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseViewModel[]>([]);
  const [formData, setFormData] = useState<EditWorkoutDto>({
    name: '',
    description: '',
    workoutExercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await ExerciseService.getAll();
      setExercises(data);
    };

    fetchExercises();
  }, []);

  const handleWorkoutData = (workout: EditWorkoutViewModel) => {
    setFormData({
      name: workout.name,
      description: workout.description ?? '',
      workoutExercises: workout.workoutExercises.map((x) => ({
        name: x.name,
        exerciseId: x.exerciseId,
        sets: x.sets ?? 0,
        reps: x.reps ?? 0,
        weight: x.weight ?? 0,
        note: x.note ?? '',
      })),
    });
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      workoutExercises: [
        ...prev.workoutExercises,
        {
          name: '',
          exerciseId: 0,
          sets: 0,
          reps: 0,
          weight: 0,
          note: '',
        },
      ],
    }));
  };

  const updateExercise = (
    index: number,
    field: keyof EditWorkoutExerciseDto,
    value: number | string,
  ) => {
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

  //GET: Workout/{ID}
  useEffect(() => {
    const fetchWorkout = async () => {
      const result = await WorkoutService.getById(Number(workoutId));
      if (!result.success) {
        toast('Något gick fel, gick inte hämta träningspass');
      }
      handleWorkoutData(result.workout);
    };
    fetchWorkout();
  }, [workoutId]);

  //Handle Sumbit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Validate form data.
    const validationResult = validateWorkoutHelper(formData);

    if (!validationResult.success) {
      toast.error(validationResult.message);
      return;
    }

    //Check duplicate exericses
    if (hasDuplicateExercises(formData.workoutExercises)) {
      toast.error('Du kan inte välja samma övning flera gånger.');
      return false;
    }

    try {
      const result = await WorkoutService.update(Number(workoutId), formData);
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
            <EditWorkoutExericeCard
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
