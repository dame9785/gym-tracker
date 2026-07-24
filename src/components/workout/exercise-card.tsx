import { WorkoutExerciseViewModel } from '@/view-models/workout-view-model';

interface ExerciseCardProps {
  exercise: WorkoutExerciseViewModel;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-xl font-semibold text-white">
        {exercise.order}. {exercise.name}
      </h2>

      <p className="mt-2 text-zinc-400">
        {exercise.sets} set × {exercise.reps} reps
      </p>

      {exercise.weight && <p className="text-orange-400">{exercise.weight} kg</p>}
    </div>
  );
}
