import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import Link from 'next/link';

interface SelectedWorkoutProps {
  workout: WeeklyWorkoutViewModel;
}

export default function SelectedWorkout({ workout }: SelectedWorkoutProps) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-xl font-bold text-white">Workout Details</h3>

      <p className="text-2xl font-semibold text-orange-400">{workout.workoutName}</p>

      <div className="mt-4 space-y-2 text-zinc-300">
        <p>📋 {workout.exerciseCount} exercises</p>
        <p>⏱️ {workout.estimatedMinutes} min</p>
        <p>📅 {new Date(workout.date).toLocaleDateString('sv-SE')}</p>
      </div>
      <div className="mt-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Exercises</h4>

        <ul className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <li key={`${exercise.id}-${index}`} className="rounded-lg bg-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-white">{exercise.name}</h5>

                {exercise.weight && (
                  <span className="rounded bg-orange-500/20 px-2 py-1 text-sm text-orange-400">
                    {exercise.weight} kg
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {exercise.sets} set × {exercise.reps} reps
              </p>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/workout/${workout.id}`}
        className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        View Workout
      </Link>
    </div>
  );
}
