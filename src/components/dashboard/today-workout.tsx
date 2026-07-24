'use client';
import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkoutSessionService } from '@/services/workout-session-service';
interface TodayWorkoutProps {
  workout?: WeeklyWorkoutViewModel;
}

export default function TodayWorkout({ workout }: TodayWorkoutProps) {
  const router = useRouter();
  const workoutSessionService = new WorkoutSessionService();

  //Start workout
  const handleStartWorkout = async () => {
    if (!workout) {
      return;
    }

    if (workout.hasActiveSession && workout.activeSessionId) {
      router.push(`/workout-sessions/${workout.activeSessionId}`);
      return;
    }

    const result = await workoutSessionService.create(workout.id);

    if (result.success) {
      router.push(`/workout-sessions/${result.workoutSession.id}`);
    }
  };
  const hasWorkout = !!workout;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Todays Workout</h2>

      {hasWorkout ? (
        <>
          <div className="mb-4 text-5xl">🏋️</div>
          <h3 className="text-2xl font-bold">{workout.workoutName}</h3>
          <p className="mt-2 text-zinc-400">
            {workout.status === 'COMPLETED' ? 'Workout completed today.' : 'Ready to train today.'}
          </p>

          {workout?.status === 'ACTIVE' && (
            <button
              onClick={handleStartWorkout}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Start workout
            </button>
          )}

          {workout?.status === 'COMPLETED' && (
            <div className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white">
              ✅ Workout Completed
            </div>
          )}
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
