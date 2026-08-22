import { WorkoutSessionWithExercisesViewModel } from '@/types/history-types';
import { CalendarDays, CheckCircle2, Clock3, Dumbbell, Layers3 } from 'lucide-react';

type Props = {
  workoutSessions: WorkoutSessionWithExercisesViewModel[];
};

export default function WorkoutSessions({ workoutSessions }: Props) {
  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">Completed Workouts</h2>

        <p className="mt-1 text-sm text-zinc-400">Your recently completed training sessions</p>
      </div>

      {/* Empty state */}
      {workoutSessions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <Dumbbell className="mx-auto mb-4 h-10 w-10 text-zinc-600" />

          <h3 className="text-lg font-semibold text-white">No completed workouts yet</h3>

          <p className="mt-2 text-sm text-zinc-500">Your completed workouts will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {workoutSessions.map((session) => {
            // Format date
            const formattedDate = session.finishedAt
              ? new Date(session.finishedAt).toLocaleString('sv-SE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Okänt datum';

            // Calculate workout duration
            const durationInSeconds = session.startedAt && session.finishedAt ? Math.floor((new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()) / 1000) : 0;

            const minutes = Math.floor(durationInSeconds / 60);

            // Calculate total sets
            const totalSets = session.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);

            return (
              <div key={session.id} className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900">
                <div className="flex flex-col gap-5">
                  {/* Workout header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Workout information */}
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-orange-500/10 p-3">
                        <Dumbbell className="h-6 w-6 text-orange-500" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white transition-colors group-hover:text-orange-400">{session.workoutName}</h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                          <CalendarDays className="h-4 w-4" />

                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />

                      <span className="text-xs font-semibold tracking-wide text-green-400">{session.status}</span>
                    </div>
                  </div>

                  {/* Workout description */}
                  {session.workoutDescription && <p className="text-sm leading-relaxed text-zinc-400">{session.workoutDescription}</p>}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    {/* Duration */}
                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-orange-500" />

                        <span className="text-sm font-semibold text-white">{minutes} min</span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">Duration</p>
                    </div>

                    {/* Exercises */}
                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-orange-500" />

                        <span className="text-sm font-semibold text-white">{session.exercises.length}</span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">Exercises</p>
                    </div>

                    {/* Sets */}
                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Layers3 className="h-4 w-4 text-orange-500" />

                        <span className="text-sm font-semibold text-white">{totalSets}</span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">Sets</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
