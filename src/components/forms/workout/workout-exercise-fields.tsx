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
  exercise: UpdateWorkoutExerciseDto;
  exercises: ExerciseViewModel[];
  onUpdate: (index: number, field: keyof UpdateWorkoutExerciseDto, value: number | string) => void;
  onRemove: (index: number) => void;
  labels: {
    exercise: string;
    selectExercise: string;
    sets: string;
    reps: string;
    weight: string;
    seconds: string;
    note: string;
    remove: string;
  };
};

export default function WorkoutExerciseFields({ index, exercise, exercises, onUpdate, onRemove, labels }: Props) {
  return (
    <div className={FormStyles.exerciseCard}>
      <div className={FormStyles.formGroup}>
        <FormField htmlFor={`exercise-${index}`} label={labels.exercise} required>
          <FormSelect id={`exercise-${index}`} value={exercise.exerciseId} onChange={(e) => onUpdate(index, 'exerciseId', Number(e.target.value))}>
            <option value={0} disabled>
              {labels.selectExercise}
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
          <FormField htmlFor={`sets-${index}`} label={labels.sets}>
            <FormInput id={`sets-${index}`} type="number" min={0} value={exercise.sets} onChange={(e) => onUpdate(index, 'sets', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`reps-${index}`} label={labels.reps}>
            <FormInput id={`reps-${index}`} type="number" min={0} value={exercise.reps} onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`weight-${index}`} label={labels.weight}>
            <FormInput id={`weight-${index}`} type="number" min={0} step="0.5" value={exercise.weight} onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor={`seconds-${index}`} label={labels.seconds}>
            <FormInput id={`seconds-${index}`} type="number" min={0} value={exercise.seconds} onChange={(e) => onUpdate(index, 'seconds', Number(e.target.value))} />
          </FormField>
        </div>
      </div>

      <div className={FormStyles.formGroup}>
        <FormField htmlFor={`note-${index}`} label={labels.note}>
          <FormTextarea id={`note-${index}`} rows={3} value={exercise.note} onChange={(e) => onUpdate(index, 'note', e.target.value)} />
        </FormField>
      </div>

      <Button type="button" variant="danger" onClick={() => onRemove(index)}>
        {labels.remove}
      </Button>
    </div>
  );
}
