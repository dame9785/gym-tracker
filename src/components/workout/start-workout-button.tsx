'use client';
import { useRouter } from 'next/navigation';
import { WorkoutSessionService } from '@/services/workout-session-service';

interface StartWorkoutButtonProps {
  workoutId: number;
}

export default function StartWorkoutButton({ workoutId }: StartWorkoutButtonProps) {
  const router = useRouter();
  const workoutSessionService = new WorkoutSessionService();
  async function handleStartWorkout() {
    const result = await workoutSessionService.create(workoutId);
    router.push(`/workout-sessions/${result.workoutSession.id}`);
  }
  return (
    <button
      onClick={handleStartWorkout}
      className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
    >
      Start Workout
    </button>
  );
}
