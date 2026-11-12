'use client';

import { useEffect, useState } from 'react';

import { getWorkoutSchedulesByMonthAction } from '@/actions/workout-schedule-actions';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import Modal from '@/components/modal/modal';
import SelectedWorkout from '@/components/dashboard/selected-workout';
import { WORKOUT_STATUS_CONFIG } from '@/components/shared/workout-status';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month - 1, day));
  }

  return days;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function WorkoutCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<WeeklyWorkoutViewModel[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WeeklyWorkoutViewModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const workoutsByDate = workouts.reduce<Record<string, WeeklyWorkoutViewModel[]>>((groups, workout) => {
    const dateKey = workout.date.slice(0, 10);

    groups[dateKey] ??= [];
    groups[dateKey].push(workout);

    return groups;
  }, {});

  const todayKey = getDateKey(new Date());

  useEffect(() => {
    let isActive = true;

    const loadWorkouts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getWorkoutSchedulesByMonthAction(currentYear, currentMonth);

        if (!isActive) return;

        if (!result.success) {
          setError(result.message);
          setWorkouts([]);
          return;
        }

        setWorkouts(result.data ?? []);
      } catch (error) {
        console.error('Failed to load calendar workouts:', error);

        if (isActive) {
          setError('Could not load workout schedules.');
          setWorkouts([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadWorkouts();

    return () => {
      isActive = false;
    };
  }, [currentYear, currentMonth]);

  return (
    <>
      <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3 sm:p-5 lg:p-6">
        {/* Calendar header */}
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
          <button type="button" onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1))} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-zinc-800 hover:text-orange-400 sm:h-14 sm:w-14" aria-label="Previous month">
            <ChevronLeft size={25} strokeWidth={2.5} />
          </button>

          <h2 className="truncate text-base font-semibold text-white capitalize sm:text-xl">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <button type="button" onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1))} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-zinc-800 hover:text-orange-400 sm:h-14 sm:w-14" aria-label="Next month">
            <ChevronRight size={25} strokeWidth={2.5} />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div key={day} className="border-b border-white/10 px-0.5 py-2 text-center text-xs font-semibold text-gray-400 sm:p-3 sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null;
            const dayWorkouts = dateKey ? (workoutsByDate[dateKey] ?? []) : [];

            const isCurrentDay = dateKey === todayKey;

            return (
              <div key={dateKey ?? `empty-${index}`} className={`min-h-[76px] min-w-0 border-r border-b border-white/10 p-1 sm:min-h-24 sm:p-2 ${isCurrentDay ? 'ring-1 ring-orange-500 ring-inset sm:ring-2' : ''}`}>
                {day && (
                  <>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7 sm:text-sm ${isCurrentDay ? 'bg-orange-500 font-bold text-black' : 'text-white'}`}>{day.getDate()}</span>

                    <div className="mt-1 space-y-1 sm:mt-2">
                      {dayWorkouts.map((workout) => {
                        const status = workout.status ? WORKOUT_STATUS_CONFIG[workout.status] : null;

                        return (
                          <button
                            key={workout.id}
                            type="button"
                            onClick={() => setSelectedWorkout(workout)}
                            title={`${workout.workoutName} - Click to view workout`}
                            className={`block w-full min-w-0 cursor-pointer truncate rounded border px-1 py-1 text-left text-xs transition hover:brightness-125 sm:px-2 ${status?.badgeClassName ?? 'border-blue-500/30 bg-blue-500/15 text-blue-300'}`}
                          >
                            <span className="hidden sm:inline">💪 </span>
                            <span className="sm:hidden">💪</span>
                            <span className="hidden sm:inline">{workout.workoutName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Loading and error states */}
        {isLoading && <p className="mt-4 text-sm text-gray-400">Loading workouts...</p>}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {!isLoading && !error && <p className="mt-4 text-sm text-gray-400">Workouts this month: {workouts.length}</p>}
      </section>

      {/* Workout overview modal */}
      <Modal isOpen={!!selectedWorkout} onClose={() => setSelectedWorkout(undefined)} title={selectedWorkout?.workoutName}>
        {selectedWorkout && <SelectedWorkout workout={selectedWorkout} />}
      </Modal>
    </>
  );
}
