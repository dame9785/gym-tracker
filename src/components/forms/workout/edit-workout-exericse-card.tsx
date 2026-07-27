// Styles
import FormStyles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';

// DTOs
import type { EditWorkoutExerciseDto } from '@/dto/edit-workout-dto';

// ViewModels
import type ExerciseViewModel from '@/view-models/excercise-view-model';

interface WorkoutExerciseCardProps {
  index: number;
  exercise: EditWorkoutExerciseDto;
  exercises: ExerciseViewModel[];
  onUpdate: (index: number, field: keyof EditWorkoutExerciseDto, value: number | string) => void;
  onRemove: (index: number) => void;
}

export default function WorkoutExerciseCard({
  index,
  exercise,
  exercises,
  onUpdate,
  onRemove,
}: WorkoutExerciseCardProps) {
  return (
    <div className={FormStyles.exerciseCard}>
      {/* Övning */}
      <div className={FormStyles.formGroup}>
        <label htmlFor={`exercise-${index}`} className={FormStyles.formLabel}>
          Övning
        </label>

        <select
          id={`exercise-${index}`}
          className={FormStyles.formSelect}
          value={exercise.exerciseId}
          onChange={(e) => onUpdate(index, 'exerciseId', Number(e.target.value))}
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
            value={exercise.sets ?? 0}
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
            min={1}
            className={FormStyles.formInput}
            value={exercise.reps}
            onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))}
          />
        </div>

        <div className={FormStyles.formGroup}>
          <label htmlFor={`weight-${index}`} className={FormStyles.formLabel}>
            Vikt (kg)
          </label>

          <input
            id={`weight-${index}`}
            value={exercise.weight ?? 0}
            type="number"
            min={0}
            step="0.5"
            className={FormStyles.formInput}
            onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Anteckning */}
      <div className={FormStyles.formGroup}>
        <label htmlFor={`note-${index}`} className={FormStyles.formLabel}>
          Anteckning
        </label>

        <textarea
          id={`note-${index}`}
          rows={3}
          className={FormStyles.formTextarea}
          value={exercise.note ?? 0}
          onChange={(e) => onUpdate(index, 'note', e.target.value)}
        />
      </div>
      <Button
        type="button"
        text="Ta bort övning"
        variant="delete"
        onClick={() => onRemove(index)}
      ></Button>
    </div>
  );
}
