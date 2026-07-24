import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import Link from 'next/link';

interface SelectedWorkoutProps {
  workout: WeeklyWorkoutViewModel;
}

export default function SelectedWorkout({ workout }: SelectedWorkoutProps) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6 space-y-2 text-zinc-300">
        <p>📋 {workout.exerciseCount} exercises</p>
        <p>⏱️ {workout.estimatedMinutes} min</p>
        <p>📅 {new Date(workout.date).toLocaleDateString('sv-SE')}</p>
      </div>
      <div className="mt-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Exercises</h4>

        <ul className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <li
              key={`${exercise.id}-${index}`}
              className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4"
            >
              <div>
                <h5 className="font-semibold text-white">
                  {exercise.order}. {exercise.name}
                </h5>

                <p className="mt-1 text-sm text-zinc-400">
                  {exercise.sets} set × {exercise.reps} reps
                </p>
              </div>

              {exercise.weight && (
                <div className="rounded-lg bg-orange-500/20 px-3 py-2 text-sm font-semibold text-orange-400">
                  {exercise.weight} kg
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/workout/${workout.id}`}
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          View Workout →
        </Link>
      </div>
    </div>
  );
}
