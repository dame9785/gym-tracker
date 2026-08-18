'use client';

//NEXT & React
import { useState } from 'react';

//Types
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

//Components
import SelectedWorkout from './selected-workout';
import Modal from '@/components/modal/modal';
import WorkoutDayCard from './workout-day-card';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
  userToken: string;
}

const week = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

export default function WeeklyOverview({ workouts, userToken }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WeeklyWorkoutViewModel>();

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold p-[10px]">Veckans översikt</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        {week.map((day) => {
          const workout = workouts.find(
            (w) =>
              new Date(w.date).toLocaleDateString('sv-SE', {
                weekday: 'long',
              }) === day.toLowerCase(),
          );

          return <WorkoutDayCard key={day} day={day} workout={workout} onClick={() => setSelectedWorkout(workout)} />;
        })}
      </div>

      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(undefined)}
        title={selectedWorkout?.workoutName}
      >
        {selectedWorkout && <SelectedWorkout workout={selectedWorkout} userToken={userToken} />}
      </Modal>
    </section>
  );
}
