'use client';

import { useEffect, useState } from 'react';
import WorkoutService from '@/services/workout-service';
import WorkoutScheduleService from '@/services/workout-schedule-service';

//Components
import Button from '@/components/button/button';

// Styles
import FormStyles from '@/components/form.module.css';

interface Workout {
  id: number;
  name: string;
  description: string | null;
}

export default function ScheduleWorkoutForm() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function loadWorkouts() {
      const result = await WorkoutService.getAll();

      if (result.success) {
        setWorkouts(result.workouts);
      }
    }

    loadWorkouts();
  }, []);

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

    const result = await WorkoutScheduleService.create({
      workoutId: Number(selectedWorkoutId),
      date,
    });

    if (result.success) {
      alert('Träningspass planerat!');

      setSelectedWorkoutId('');
      setDate('');
    } else {
      alert(result.message);
    }
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
      <Button type="submit" text="Lägg till" variant="primary"></Button>
    </form>
  );
}
