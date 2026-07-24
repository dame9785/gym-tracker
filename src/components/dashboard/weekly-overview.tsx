'use client';

import { useState } from 'react';
import WorkoutDayCard from './workout-day-card';
import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import SelectedWorkout from './selected-workout';
import Modal from '@/components/modal/modal';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
}

const week = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WeeklyWorkoutViewModel>();

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Weekly Overview</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
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

      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(undefined)}
        title={selectedWorkout?.workoutName}
      >
        {selectedWorkout && <SelectedWorkout workout={selectedWorkout} />}
      </Modal>
    </section>
  );
}
