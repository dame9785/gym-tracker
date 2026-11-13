import { Check, Plus } from 'lucide-react';

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
          <option value="" disabled className="bg-zinc-900">
            Select the main muscle group
          </option>

          {MUSCLE_GROUPS.map((muscle) => (
            <option key={muscle} value={muscle} className="bg-zinc-900">
              {muscle}
            </option>
          ))}
        </FormSelect>
      </FormField>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-zinc-200">Secondary muscle groups</label>

          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">{secondaryMuscles.length} selected</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableSecondaryMuscles.map((muscle) => {
            const selected = secondaryMuscles.includes(muscle);

            return (
              <button
                key={muscle}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => onToggleSecondaryMuscle(muscle)}
                className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected ? 'border-orange-500/60 bg-orange-500/10 text-orange-300' : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/70 hover:text-zinc-200'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span>{muscle}</span>

                {selected ? <Check className="h-4 w-4 shrink-0 text-orange-400" /> : <Plus className="h-4 w-4 shrink-0 text-zinc-600" />}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs leading-5 text-zinc-500">Select all muscles that assist during the exercise. Click a selected muscle again to remove it.</p>

        {secondaryError && <p className="mt-1.5 text-xs text-red-400">{secondaryError}</p>}
      </div>
    </div>
  );
}
