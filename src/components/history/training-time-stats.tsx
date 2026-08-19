export default function TrainingTimeStats() {
  return (
    <div className="mb-10 grid gap-5 md:grid-cols-2">
      {/* Total Training Time */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Training Time</p>

            {/* <p className="mt-3 text-4xl font-bold tracking-tight text-white">
              {formatDuration(totalMinutes)}
            </p> */}

            <p className="mt-3 text-4xl font-bold tracking-tight text-blue-400">—</p>
            <p className="mt-2 text-xs text-zinc-500">Time spent training</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">⏱️</div>
        </div>
      </div>

      {/* Exercises Completed */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Exercises Completed</p>

            {/* <p className="mt-3 text-4xl font-bold tracking-tight text-white">
              {totalExercises}
            </p> */}

            <p className="mt-3 text-4xl font-bold tracking-tight text-purple-400">—</p>
            <p className="mt-2 text-xs text-zinc-500">Exercises completed</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">💪</div>
        </div>
      </div>
    </div>
  );
}
