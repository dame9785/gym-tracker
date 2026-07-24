'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Dumbbell, History } from 'lucide-react';

import { HistoryViewModel } from '@/view-models/history-view-models';

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  return `${hours} h ${mins} min`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryViewModel[]>([]);
  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    remainingWorkouts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/history');

        const result = await response.json();

        if (result.success) {
          setHistory(result.history);
          setSummary(result.summary);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="text-4xl font-bold text-white">Workout History</h1>

        <p className="mt-6 text-zinc-400">Loading workout history...</p>
      </div>
    );
  }

  const totalMinutes = history.reduce((sum, workout) => sum + workout.durationInMinutes, 0);

  const totalExercises = history.reduce((sum, workout) => sum + workout.exerciseCount, 0);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="rounded-2xl bg-orange-500 p-3">
          <History className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">Workout History</h1>

          <p className="text-zinc-400">Review your completed workouts</p>
        </div>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Total Workouts</p>

          <p className="mt-3 text-4xl font-bold text-white">{summary.totalWorkouts}</p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Completed</p>

          <p className="mt-3 text-4xl font-bold text-green-400">{summary.completedWorkouts}</p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Remaining</p>

          <p className="mt-3 text-4xl font-bold text-orange-400">{summary.remainingWorkouts}</p>
        </div>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Total Training Time</p>

          <p className="mt-3 text-4xl font-bold text-white">{formatDuration(totalMinutes)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Exercises Completed</p>

          <p className="mt-3 text-4xl font-bold text-white">{totalExercises}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-10 text-center">
          <p className="text-lg text-zinc-400">No completed workouts found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {history.map((workout) => (
            <div
              key={workout.id}
              className="cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10"
            >
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Dumbbell className="h-5 w-5 text-orange-500" />
                {workout.workoutName}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays className="h-4 w-4" />
                {new Date(workout.startedAt).toLocaleDateString('sv-SE')}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Exercises</p>

                  <div className="mt-2 flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-orange-500" />

                    <span className="text-2xl font-bold text-white">{workout.exerciseCount}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Duration</p>

                  <div className="mt-2 flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-orange-500" />

                    <span className="text-2xl font-bold text-white">
                      {formatDuration(workout.durationInMinutes)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                  View Workout →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
