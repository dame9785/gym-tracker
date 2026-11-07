
'use client';

import { useEffect, useState } from 'react';
import { Check, Circle, Dumbbell, Moon, X } from 'lucide-react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

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

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export default function WeeklyOverview({ workouts }: WeeklyOverviewProps) {
  const [selectedWorkout, setSelectedWorkout] =
    useState<WeeklyWorkoutViewModel>();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  // Set today's weekday after mounting to avoid hydration mismatch.
  useEffect(() => {
    const today = getTodayIndex();

    setTodayIndex(today);
    setSelectedDayIndex(today);
  }, []);

  const getWorkoutForDay = (day: string) => {
    return workouts.find(
      (workout) =>
        new Date(workout.date).toLocaleDateString('sv-SE', {
          weekday: 'long',
        }) === day.toLowerCase(),
    );
  };

  const selectedDay = week[selectedDayIndex];
  const selectedDayWorkout = getWorkoutForDay(selectedDay.name);

  const getDayIndicator = (workout?: WeeklyWorkoutViewModel) => {
    if (!workout) {
      return <Moon className="h-3.5 w-3.5 text-zinc-500" />;
    }

    switch (workout.status) {
      case 'COMPLETED':
        return <Check className="h-3.5 w-3.5 text-green-400" />;

      case 'ACTIVE':
        return (
          <Circle className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
        );

      case 'NOTCOMPLETED':
        return <X className="h-3.5 w-3.5 text-red-400" />;

      default:
        return <Dumbbell className="h-3.5 w-3.5 text-blue-400" />;
    }
  };

  return (
    <section className="min-w-0">
      <h2 className="mb-4 px-1 text-xl font-semibold sm:mb-6 sm:px-2.5 sm:text-2xl">
        Veckans översikt
      </h2>

      {/* Mobile and tablet view */}
      <div className="lg:hidden">
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
                onClick={() => setSelectedDayIndex(index)}
                aria-label={`${day.name}${isToday ? ', today' : ''}`}
                aria-pressed={isSelected}
                className={`
                  flex min-w-0 flex-col items-center justify-center
                  gap-2 rounded-xl border px-1 py-3
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-950/20'
                      : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-600'
                  }
                `}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {day.short}
                </span>

                <span className="flex h-5 w-5 items-center justify-center">
                  {getDayIndicator(workout)}
                </span>

                {isToday ? (
                  <span className="text-xs font-bold text-orange-400">
                    IDAG
                  </span>
                ) : (
                  <span className="h-3" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day heading */}
        <div className="mb-3 flex min-w-0 items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">
              {selectedDay.name}
            </h3>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {selectedDayWorkout
                ? 'Träningspass planerat eller registrerat'
                : 'Ingen träning planerad'}
            </p>
          </div>

          {selectedDayWorkout && (
            <span
              className={`
                shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold
                ${
                  selectedDayWorkout.status === 'COMPLETED'
                    ? 'bg-green-500/10 text-green-400'
                    : selectedDayWorkout.status === 'ACTIVE'
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-red-500/10 text-red-400'
                }
              `}
            >
              {selectedDayWorkout.status === 'COMPLETED'
                ? 'Completed'
                : selectedDayWorkout.status === 'ACTIVE'
                  ? 'Active'
                  : 'Missed'}
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
          <button
            type="button"
            onClick={() =>
              setSelectedDayIndex((current) => (current + 6) % 7)
            }
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            ← Föregående
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedDayIndex((current) => (current + 1) % 7)
            }
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            Nästa →
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden min-w-0 auto-rows-fr grid-cols-2 gap-3 lg:grid lg:grid-cols-4 lg:gap-4 xl:grid-cols-7">
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
