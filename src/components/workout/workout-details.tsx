import StartWorkoutButton from '@/components/workout/start-workout-button';
import { WorkoutViewModel } from '@/types/workout-types';

interface Props {
  workout: WorkoutViewModel;
}

export default function WorkoutDetails({ workout }: Props) {
  return (
    <section className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">Träningspass</p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{workout.name}</h1>
            {workout.description && <p className="mt-3 max-w-2xl leading-6 text-gray-400">{workout.description}</p>}
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-white">{workout.workoutExercises.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">Övningar</p>
          </div>
        </div>
      </header>

      {/* Exercises */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Övningar</h2>

          <span className="text-sm text-gray-500">{workout.workoutExercises.length} totalt</span>
        </div>

        <div className="space-y-3">
          {workout.workoutExercises.map((exercise, index) => (
            <article key={exercise.exerciseId} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]">
              <div className="flex items-center gap-4">
                {/* Exercise number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">{String(index + 1).padStart(2, '0')}</div>

                {/* Exercise info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-white">{exercise.name}</h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">{exercise.sets} set</span>

                    <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">{exercise.reps} reps</span>

                    {exercise.weight !== null && <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">{exercise.weight} kg</span>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
