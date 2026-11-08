import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

import type { ExerciseViewModel } from '@/types/exercise-types';
import type { AddWorkoutDto } from '@/schemas/workout-schemas';

type WorkoutExercise = AddWorkoutDto['workoutExercises'][number];

interface WorkoutExerciseCardProps {
  index: number;
  exercise: WorkoutExercise;
  exercises: ExerciseViewModel[];
  onUpdate: (index: number, field: keyof WorkoutExercise, value: number | string) => void;
  onRemove: (index: number) => void;
}

export default function WorkoutExerciseCard({ index, exercise, exercises, onUpdate, onRemove }: WorkoutExerciseCardProps) {
  return (
    <div className={FormStyles.exerciseCard}>
      <div className={FormStyles.formGroup}>
        <label htmlFor={`exercise-${index}`} className={FormStyles.formLabel}>
          Exercise
        </label>

        <select id={`exercise-${index}`} className={FormStyles.formSelect} value={exercise.exerciseId} onChange={(e) => onUpdate(index, 'exerciseId', Number(e.target.value))}>
          <option value={0} disabled>
            Select exercise
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
            Sets
          </label>

          <input id={`sets-${index}`} type="number" min={1} className={FormStyles.formInput} value={exercise.sets} onChange={(e) => onUpdate(index, 'sets', Number(e.target.value))} />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`reps-${index}`} className={FormStyles.formLabel}>
            Reps
          </label>

          <input id={`reps-${index}`} type="number" className={FormStyles.formInput} value={exercise.reps} onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))} />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`weight-${index}`} className={FormStyles.formLabel}>
            Weight (kg)
          </label>

          <input id={`weight-${index}`} type="number" min={0} step="0.5" className={FormStyles.formInput} value={exercise.weight ?? ''} onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))} />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`seconds-${index}`} className={FormStyles.formLabel}>
            Seconds
          </label>

          <input id={`seconds-${index}`} type="number" min={0} className={FormStyles.formInput} value={exercise.seconds ?? ''} onChange={(e) => onUpdate(index, 'seconds', Number(e.target.value))} />
        </div>
      </div>

      <div className={FormStyles.formGroup}>
        <label htmlFor={`note-${index}`} className={FormStyles.formLabel}>
          Note
        </label>

        <textarea id={`note-${index}`} rows={3} className={FormStyles.formTextarea} value={exercise.note} onChange={(e) => onUpdate(index, 'note', e.target.value)} />
      </div>

      <Button type="button" variant="danger" onClick={() => onRemove(index)}>
        Remove
      </Button>
    </div>
  );
}
