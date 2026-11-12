'use client';

import { useState, useSyncExternalStore } from 'react';
import { Dumbbell, Moon } from 'lucide-react';
import { getISOWeek } from 'date-fns';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

import { WORKOUT_STATUS_CONFIG } from '@/components/shared/workout-status';
import SelectedWorkout from './selected-workout';
import Modal from '@/components/modal/modal';
import WorkoutDayCard from './workout-day-card';

interface WeeklyOverviewProps {
  workouts: WeeklyWorkoutViewModel[];
}

const week = [
  { name: 'Måndag', short: 'Mån' },
  { name: 'Tisdag', short: 'Tis' },
  { name: 'Onsdag', short: 'Ons' },
  { name: 'Torsdag', short: 'Tor' },
  { name: 'Fredag', short: 'Fre' },
  { name: 'Lördag', short: 'Lör' },
  { name: 'Söndag', short: 'Sön' },
];

const plannedStatus = {
  label: 'Planned',
  badgeClassName: 'bg-blue-500/10 text-blue-400',
  icon: <Dumbbell className="h-3.5 w-3.5 text-blue-400" />,
};

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

// useSyncExternalStore subscription
const subscribe = () => () => {};

// Server and initial hydration snapshot
const getServerTodayIndex = () => null;

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WeeklyWorkoutViewModel>();

  const todayIndex = useSyncExternalStore(subscribe, getTodayIndex, getServerTodayIndex);

  const [manualSelectedDayIndex, setManualSelectedDayIndex] = useState<number | null>(null);

  const selectedDayIndex = manualSelectedDayIndex ?? todayIndex ?? 0;

  const weekNumber = getISOWeek(new Date());

  const getWorkoutForDay = (day: string) => {
    return workouts.find(
      (workout) =>
        new Date(workout.date).toLocaleDateString('sv-SE', {
          weekday: 'long',
        }) === day.toLowerCase(),
    );
  };

  const getDayIndicator = (workout?: WeeklyWorkoutViewModel) => {
    if (!workout) {
      return <Moon className="h-3.5 w-3.5 text-zinc-500" />;
    }

    if (!workout.status) {
      return plannedStatus.icon;
    }

    return WORKOUT_STATUS_CONFIG[workout.status].icon;
  };

  const getWorkoutStatus = (workout: WeeklyWorkoutViewModel) => {
    return workout.status ? WORKOUT_STATUS_CONFIG[workout.status] : plannedStatus;
  };

  const selectedDay = week[selectedDayIndex];
  const selectedDayWorkout = getWorkoutForDay(selectedDay.name);

  return (
    <section className="min-w-0">
      <h3 className="mb-4 px-1 text-xl font-semibold sm:mb-6 sm:px-2.5 sm:text-2xl">
        Overview of the week number <span className="text-orange-400">({weekNumber})</span>
      </h3>

      {/* Mobile and tablet view */}
      <div className="mt-5 lg:hidden">
        {/* Week selector */}
        <div className="mb-4 grid grid-cols-7 gap-1.5 sm:gap-2">
          {week.map((day, index) => {
            const workout = getWorkoutForDay(day.name);
            const isSelected = selectedDayIndex === index;
            const isToday = todayIndex === index;

            return (
              <button
                key={day.name}
                type="button"
                onClick={() => setManualSelectedDayIndex(index)}
                aria-label={`${day.name}${isToday ? ', today' : ''}`}
                aria-pressed={isSelected}
                className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border px-1 py-3 transition-all duration-200 ${
                  isSelected ? 'border-orange-500 bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-950/20' : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span className="text-xs font-semibold sm:text-sm">{day.short}</span>

                <span className="flex h-5 w-5 items-center justify-center">{getDayIndicator(workout)}</span>

                {isToday ? <span className="text-xs font-bold text-orange-400">IDAG</span> : <span className="h-3" />}
              </button>
            );
          })}
        </div>

        {/* Selected day heading */}
        <div className="mb-3 flex min-w-0 items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">{selectedDay.name}</h3>

            <p className="mt-1 text-sm leading-5 text-zinc-500">{selectedDayWorkout ? 'Träningspass planerat eller registrerat' : 'Ingen träning planerad'}</p>
          </div>

          {selectedDayWorkout && (
            <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getWorkoutStatus(selectedDayWorkout).badgeClassName}`}>
              {getWorkoutStatus(selectedDayWorkout).icon}
              {getWorkoutStatus(selectedDayWorkout).label}
            </span>
          )}
        </div>

        {/* Selected day card */}
        <WorkoutDayCard
          day={selectedDay.name}
          workout={selectedDayWorkout}
          onClick={() => {
            if (selectedDayWorkout) {
              setSelectedWorkout(selectedDayWorkout);
            }
          }}
        />

        {/* Previous / next day */}
        <div className="mt-3 flex items-center justify-between">
          <button type="button" onClick={() => setManualSelectedDayIndex((current) => ((current ?? todayIndex ?? 0) + 6) % 7)} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
            ← Föregående
          </button>

          <button type="button" onClick={() => setManualSelectedDayIndex((current) => ((current ?? todayIndex ?? 0) + 1) % 7)} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
            Nästa →
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="mt-5 hidden min-w-0 auto-rows-fr grid-cols-2 gap-3 lg:grid lg:grid-cols-4 lg:gap-4 xl:grid-cols-7">
        {week.map((day) => {
          const workout = getWorkoutForDay(day.name);

          return (
            <div key={day.name} className="h-full min-w-0">
              <WorkoutDayCard
                day={day.name}
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

      {/* Workout details modal */}
      <Modal isOpen={!!selectedWorkout} onClose={() => setSelectedWorkout(undefined)} title={selectedWorkout?.workoutName}>
        {selectedWorkout && <SelectedWorkout workout={selectedWorkout} />}
      </Modal>
    </section>
  );
}
