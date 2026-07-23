import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';

interface TodayWorkoutProps {
  workout?: WeeklyWorkoutViewModel;
}

export default function TodayWorkout({ workout }: TodayWorkoutProps) {
  const hasWorkout = !!workout;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Todays Workout</h2>

      {hasWorkout ? (
        <>
          <div className="mb-4 text-5xl">🏋️</div>

          <h3 className="text-2xl font-bold">{workout.workoutName}</h3>

          <p className="mt-2 text-zinc-400">Ready to train today.</p>

          <button className="mt-6 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
            Start Workout
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-5xl">😴</div>

          <h3 className="text-2xl font-bold">Rest Day</h3>

          <p className="mt-2 text-zinc-400">No workout planned today.</p>
        </>
      )}
    </div>
  );
}
