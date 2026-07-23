interface WorkoutDayCardProps {
  day: string;
  workoutName?: string;
}

export default function WorkoutDayCard({ day, workoutName }: WorkoutDayCardProps) {
  const hasWorkout = !!workoutName;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        hasWorkout ? 'border-orange-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <p className="text-sm font-medium text-zinc-400">{day}</p>

      <div className="mt-6">
        {hasWorkout ? (
          <>
            <span className="text-2xl">🏋️</span>

            <h3 className="mt-2 text-lg font-bold text-white">{workoutName}</h3>

            <p className="mt-1 text-sm text-green-400">Workout planned</p>
          </>
        ) : (
          <>
            <span className="text-2xl">😴</span>

            <h3 className="mt-2 text-lg font-bold text-zinc-500">Rest day</h3>

            <p className="mt-1 text-sm text-zinc-600">No workout planned</p>
          </>
        )}
      </div>
    </div>
  );
}
