'use client';

import { useEffect, useState } from 'react';

import { getWorkoutSchedulesByMonthAction } from '@/actions/workout-schedule-actions';

import type { CalendarWorkoutViewModel } from '@/types/calender-types';

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const days = [];

  for (let i = 0; i < firstWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month - 1, day));
  }

  return days;
}

export default function WorkoutCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<CalendarWorkoutViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const getWorkoutsForDay = (day: Date) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);

      return workoutDate.getFullYear() === day.getFullYear() && workoutDate.getMonth() === day.getMonth() && workoutDate.getDate() === day.getDate();
    });
  };

  const isToday = (day: Date) => {
    const today = new Date();

    return day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate();
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

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

        setWorkouts(result.data);
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
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1))}
          className="rounded-md px-3 py-2 text-lg text-white transition hover:bg-white/10"
          aria-label="Previous month"
        >
          ‹
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold capitalize">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-md border border-orange-500/50 px-3 py-1.5 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10"
          >
            Today
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1))}
          className="rounded-md px-3 py-2 text-lg text-white transition hover:bg-white/10"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="border-b border-white/10 p-3 text-center text-sm font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayWorkouts = day ? getWorkoutsForDay(day) : [];

          return (
            <div key={index} className={`min-h-24 border-b border-r border-white/10 p-2 ${day && isToday(day) ? 'ring-2 ring-inset ring-orange-500' : ''}`}>
              {day && (
                <>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      isToday(day) ? 'bg-orange-500 font-bold text-black' : 'text-white'
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  <div className="mt-2 space-y-1">
                    {dayWorkouts.map((workout) => (
                      <button
                        key={workout.id}
                        type="button"
                        className="w-full rounded-md bg-blue-500/20 px-2 py-1 text-left text-xs text-blue-300 transition hover:bg-blue-500/30"
                      >
                        💪 {workout.workoutName}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {isLoading && <p className="mt-4 text-sm text-gray-400">Loading workouts...</p>}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {!isLoading && !error && <p className="mt-4">Workouts this month: {workouts.length}</p>}
    </section>
  );
}
