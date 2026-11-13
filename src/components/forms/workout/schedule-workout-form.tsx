'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CalendarPlus } from 'lucide-react';

import { createWorkoutScheduleAction } from '@/actions/workout-schedule-actions';

import Button from '@/components/button/button';
import FormStyles from '@/components/forms/form.module.css';
import FormPageHeader from '@/components/forms/shared/form-page-header';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import type { WorkoutViewModel } from '@/types/workout-types';

import { schedelueWorkoutSchema, type SchedelueWorkoutDto } from '@/schemas/schedelue-workout-schemas';

import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function ScheduleWorkoutForm({ workouts }: Props) {
  const router = useRouter();

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [date, setDate] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof SchedelueWorkoutDto, string>>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors({});

    const dto = {
      workoutId: Number(selectedWorkoutId),
      date,
    };

    const validation = schedelueWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<SchedelueWorkoutDto>(validation.error.issues));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createWorkoutScheduleAction(dto);

      if (!result.success) {
        toast.error(result.message || 'Could not schedule workout.');
        return;
      }

      toast.success('Workout scheduled successfully.');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to schedule workout:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={FormStyles.formContainer}>
      <FormPageHeader backHref="/workout" backLabel="Back to workout" eyebrow="Workout planning" title="Schedule" highlightedTitle="workout" description="Choose a workout and a date to add it to your training schedule." icon={CalendarPlus} />

      <form onSubmit={handleSubmit} className={FormStyles.form}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor="workout" label="Workout" required error={errors.workoutId}>
            <FormSelect id="workout" name="workoutId" value={selectedWorkoutId} onChange={(e) => setSelectedWorkoutId(e.target.value)} disabled={isSubmitting} aria-invalid={!!errors.workoutId} required>
              <option value="">Select workout</option>

              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor="date" label="Date" required error={errors.date}>
            <FormInput id="date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isSubmitting} aria-invalid={!!errors.date} required />
          </FormField>
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Schedule workout'}
        </Button>
      </form>
    </div>
  );
}
