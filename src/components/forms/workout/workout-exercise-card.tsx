//CSS Modules
import FormStyles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';

//Types
import type { RegisterWorkoutExerciseDto, ExerciseViewModel } from '@/types/exercise-types';

//Props
interface WorkoutExerciseCardProps {
  index: number;
  exercise: RegisterWorkoutExerciseDto;
  exercises: ExerciseViewModel[];
  onUpdate: (index: number, field: keyof RegisterWorkoutExerciseDto, value: number | string) => void;
  onRemove: (index: number) => void;
}

export default function WorkoutExerciseCard({ index, exercise, exercises, onUpdate, onRemove }: WorkoutExerciseCardProps) {
  return (
    <div className={FormStyles.exerciseCard}>
      {/* Övning */}
      <div className={FormStyles.formGroup}>
        <label htmlFor={`exercise-${index}`} className={FormStyles.formLabel}>
          Exericse
        </label>

        <select
          id={`exercise-${index}`}
          className={FormStyles.formSelect}
          value={exercise.exerciseId}
          onChange={(e) => onUpdate(index, 'exerciseId', Number(e.target.value))}
        >
          <option value={0} disabled>
            Select exericse
          </option>

          {exercises.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Set / Reps / Vikt */}
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
            onChange={(e) => onUpdate(index, 'sets', Number(e.target.value))}
          />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`reps-${index}`} className={FormStyles.formLabel}>
            Reps
          </label>

          <input
            id={`reps-${index}`}
            type="number"
            className={FormStyles.formInput}
            value={exercise.reps}
            onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))}
          />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`weight-${index}`} className={FormStyles.formLabel}>
            Weight (kg)
          </label>

          <input
            id={`weight-${index}`}
            type="number"
            min={0}
            step="0.5"
            className={FormStyles.formInput}
            value={exercise.weight ?? ''}
            onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))}
          />
        </div>
        <div className={FormStyles.formGroup}>
          <label htmlFor={`seconds-${index}`} className={FormStyles.formLabel}>
            Seconds
          </label>

          <input
            id={`seconds-${index}`}
            type="number"
            min={0}
            step="0.5"
            className={FormStyles.formInput}
            value={exercise.seconds ?? ''}
            onChange={(e) => onUpdate(index, 'seconds', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Anteckning */}
      <div className={FormStyles.formGroup}>
        <label htmlFor={`note-${index}`} className={FormStyles.formLabel}>
          Note
        </label>

        <textarea
          id={`note-${index}`}
          rows={3}
          className={FormStyles.formTextarea}
          value={exercise.note}
          onChange={(e) => onUpdate(index, 'note', e.target.value)}
        />
      </div>
      <Button type="button" variant="delete" onClick={() => onRemove(index)}>
        Remove
      </Button>
    </div>
  );
}
