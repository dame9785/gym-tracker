import { Check, Plus } from 'lucide-react';

import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormSelect from '@/components/ui/form-select';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];

type Props = {
  primaryMuscle: string;
  secondaryMuscles: string[];
  onPrimaryMuscleChange: (value: string) => void;
  onToggleSecondaryMuscle: (muscle: string) => void;
  primaryError?: string;
  secondaryError?: string;
  disabled?: boolean;
};

export default function MuscleGroupSelector({ primaryMuscle, secondaryMuscles, onPrimaryMuscleChange, onToggleSecondaryMuscle, primaryError, secondaryError, disabled = false }: Props) {
  const availableSecondaryMuscles = MUSCLE_GROUPS.filter((muscle) => muscle !== primaryMuscle);

  return (
    <div className="space-y-6">
      <FormField htmlFor="primaryMuscle" label="Primary muscle group" required error={primaryError}>
        <FormSelect id="primaryMuscle" name="primaryMuscle" value={primaryMuscle} onChange={(e) => onPrimaryMuscleChange(e.target.value)} required disabled={disabled} aria-invalid={!!primaryError}>
          <option value="" disabled className="bg-surface">
            Select the main muscle group
          </option>

          {MUSCLE_GROUPS.map((muscle) => (
            <option key={muscle} value={muscle} className="bg-surface">
              {muscle}
            </option>
          ))}
        </FormSelect>
      </FormField>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label className="text-text-secondary text-sm font-medium">Secondary muscle groups</label>

          <span className="border-border-hover bg-surface-secondary text-text-muted rounded-full border px-2.5 py-1 text-xs">{secondaryMuscles.length} selected</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableSecondaryMuscles.map((muscle) => {
            const selected = secondaryMuscles.includes(muscle);

            return (
              <Button
                key={muscle}
                type="button"
                variant="ghost"
                size="md"
                disabled={disabled}
                ariaPressed={selected}
                ariaLabel={`${muscle}${selected ? ', selected' : ''}`}
                onClick={() => onToggleSecondaryMuscle(muscle)}
                className={`!flex !min-h-11 !w-full !justify-between !rounded-xl !border !px-3 !py-2.5 !text-left !text-sm !font-normal !tracking-normal transition ${
                  selected ? '!border-primary/60 !bg-primary/10 !text-primary' : '!border-border !bg-background/50 !text-text-muted hover:!border-border-hover hover:!bg-surface-hover hover:!text-text-secondary'
                }`}
              >
                <span>{muscle}</span>

                {selected ? <Check className="text-primary h-4 w-4 shrink-0" /> : <Plus className="text-text-muted h-4 w-4 shrink-0" />}
              </Button>
            );
          })}
        </div>

        <p className="text-text-muted mt-3 text-xs leading-5">Select all muscles that assist during the exercise. Click a selected muscle again to remove it.</p>

        {secondaryError && <p className="text-danger mt-1.5 text-xs">{secondaryError}</p>}
      </div>
    </div>
  );
}
