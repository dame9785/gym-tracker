'use client';

import { useState } from 'react';
import WorkoutDayCard from './workout-day-card';
import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import SelectedWorkout from './selected-workout';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
}

const week = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WeeklyWorkoutViewModel | undefined>();
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Weekly Overview</h2>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
        {week.map((day) => {
          const workout = workouts.find(
            (w) =>
              new Date(w.date).toLocaleDateString('sv-SE', {
                weekday: 'long',
              }) === day.toLowerCase(),
          );

          return (
            <WorkoutDayCard
              key={day}
              day={day}
              workout={workout}
              onClick={() => setSelectedWorkout(workout)}
            />
          );
        })}
      </div>
      {selectedWorkout && <SelectedWorkout workout={selectedWorkout} />}
    </section>
  );
}
