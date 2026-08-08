import StartWorkoutButton from '@/components/workout/start-workout-button';
import { WorkoutViewModel } from '@/types/workout-types';
interface Props {
  workout: WorkoutViewModel;
}
export default function WorkoutDetails({ workout }: Props) {
  return (
    <section>
      <header>
        <h1 className="text-3xl font-bold text-white">{workout.name}</h1>

        {workout.description && <p className="mt-2 text-gray-400">{workout.description}</p>}
      </header>

      <div className="mt-8 space-y-4">
        {workout.exercises.map((exercise) => (
          <article key={exercise.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold text-white">{exercise.name}</h2>

            <p className="mt-1 text-sm text-gray-400">
              {exercise.sets} set × {exercise.reps} reps
            </p>

            {exercise.weight !== null && <p className="mt-1 text-sm text-gray-400">Vikt: {exercise.weight} kg</p>}
          </article>
        ))}
      </div>

      <StartWorkoutButton workoutId={workout.id} />
    </section>
  );
}
