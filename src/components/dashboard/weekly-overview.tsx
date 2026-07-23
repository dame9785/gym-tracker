'use client';

import WorkoutDayCard from './workout-day-card';
import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
}

const week = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Weekly Overview</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        {week.map((day) => {
          const workout = workouts.find(
            (w) =>
              new Date(w.date).toLocaleDateString('sv-SE', {
                weekday: 'long',
              }) === day.toLowerCase(),
          );

          return <WorkoutDayCard key={day} day={day} workoutName={workout?.workoutName} />;
        })}
      </div>
    </section>
  );
}
