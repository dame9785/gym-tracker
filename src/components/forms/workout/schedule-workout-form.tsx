'use client';

import { useState } from 'react';
import WorkoutScheduleService from '@/services/workout-schedule-service';

//Components
import Button from '@/components/button/button';

// Styles
import FormStyles from '@/components/forms/form.module.css';
import { WorkoutViewModel } from '@/types/workout-types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function ScheduleWorkoutForm({ workouts }: Props) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedWorkoutId) {
      alert('Välj ett workout.');
      return;
    }

    if (!date) {
      alert('Välj ett datum.');
      return;
    }

    const response = await WorkoutScheduleService.create({ workoutId: Number(selectedWorkoutId), date });
    if (!response.success) {
      toast.error('Gick inte schemalägga passet');
      return;
    }

    toast.success('Passet är nu schemalagd');
    router.push('/log-weight');
  }

  return (
    <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Planera <span>träningspass</span>
        </h1>
      </div>
      <div className={FormStyles.formGrouo}>
        <label htmlFor="workout">Workout</label>
        <select
          className={FormStyles.formSelect}
          id="workout"
          value={selectedWorkoutId}
          onChange={(e) => setSelectedWorkoutId(e.target.value)}
        >
          <option value="">Välj workout</option>
          {workouts.map((workout) => (
            <option key={workout.id} value={workout.id}>
              {workout.name}
            </option>
          ))}
        </select>
        <div className={FormStyles.formGroup}>
          <label htmlFor="date" className={FormStyles.formLabel}>
            Datum
          </label>
          <input
            className={FormStyles.formInput}
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" variant="primary">
        Schemalägg passet
      </Button>
    </form>
  );
}
