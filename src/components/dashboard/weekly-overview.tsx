
'use client';

import { useState } from 'react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

import SelectedWorkout from './selected-workout';
import Modal from '@/components/modal/modal';
import WorkoutDayCard from './workout-day-card';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
}

const week = [
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag',
  'Söndag',
];

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] =
    useState<WeeklyWorkoutViewModel>();

  return (
    <section className="min-w-0">
      <h2 className="mb-4 px-1 text-xl font-semibold sm:mb-6 sm:px-2.5 sm:text-2xl">
        Veckans översikt
      </h2>

      <div className="grid min-w-0 auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-7">
        {week.map((day) => {
          const workout = workouts.find(
            (w) =>
              new Date(w.date).toLocaleDateString('sv-SE', {
                weekday: 'long',
              }) === day.toLowerCase(),
          );

          return (
            <div key={day} className="h-full min-w-0">
              <WorkoutDayCard
                day={day}
                workout={workout}
                onClick={() => {
                  if (workout) {
                    setSelectedWorkout(workout);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(undefined)}
        title={selectedWorkout?.workoutName}
      >
        {selectedWorkout && (
          <SelectedWorkout workout={selectedWorkout} />
        )}
      </Modal>
    </section>
  );
}
