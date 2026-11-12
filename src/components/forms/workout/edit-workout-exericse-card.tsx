import FormStyles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import FormTextarea from '@/components/ui/form-textarea';

import type { ExerciseViewModel } from '@/types/exercise-types';
import type { UpdateWorkoutExerciseDto } from '@/schemas/workout-schemas';

type Props = {
  index: number;
  workoutExericse: UpdateWorkoutExerciseDto;
  exercises: ExerciseViewModel[];
  onUpdate: (index: number, field: keyof UpdateWorkoutExerciseDto, value: number | string) => void;
  onRemove: (index: number) => void;
};

export default function WorkoutExerciseCard({ index, workoutExericse, exercises, onUpdate, onRemove }: Props) {
  return (
    <div className={FormStyles.exerciseCard}>
      <div className={FormStyles.formGroup}>
        <FormField htmlFor={`exercise-${index}`} label="Övning">
          <FormSelect id={`exercise-${index}`} value={workoutExericse.exerciseId} onChange={(e) => onUpdate(index, 'exerciseId', Number(e.target.value))}>
            <option value={0} disabled>
              Välj övning
            </option>

            {exercises.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      <div className={FormStyles.exerciseGrid}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`sets-${index}`} label="Set">
            <FormInput id={`sets-${index}`} type="number" value={workoutExericse.sets ?? 0} onChange={(e) => onUpdate(index, 'sets', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`reps-${index}`} label="Reps">
            <FormInput id={`reps-${index}`} type="number" value={workoutExericse.reps} onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`weight-${index}`} label="Vikt (kg)">
            <FormInput id={`weight-${index}`} type="number" step="0.5" value={workoutExericse.weight ?? 0} onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`seconds-${index}`} label="Seconds">
            <FormInput id={`seconds-${index}`} type="number" value={workoutExericse.seconds ?? 0} onChange={(e) => onUpdate(index, 'seconds', Number(e.target.value))} />
          </FormField>
        </div>
      </div>

      <div className={FormStyles.formGroup}>
        <FormField htmlFor={`note-${index}`} label="Anteckning">
          <FormTextarea id={`note-${index}`} rows={3} value={workoutExericse.note ?? ''} onChange={(e) => onUpdate(index, 'note', e.target.value)} />
        </FormField>
      </div>

      <Button type="button" variant="danger" onClick={() => onRemove(index)}>
        Ta bort övning
      </Button>
    </div>
  );
}
