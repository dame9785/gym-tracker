import { redirect } from 'next/navigation';

import WorkoutDetails from '@/components/workout/workout-details';
import ErrorMessage from '@/components/ui/error-message';

import { WorkoutService } from '@/services/workout-service';
import { WorkoutSessionService } from '@/services/workout-session-service';

import { requireAuth } from '@/lib/auth';
import type { WorkoutSessionViewModel } from '@/types/workout-types';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireAuth();
  const workoutId = Number(id);

  if (!Number.isSafeInteger(workoutId) || workoutId <= 0) {
    redirect('/workout');
  }

  const workoutService = new WorkoutService();
  const workoutSessionService = new WorkoutSessionService();

  let workout: Awaited<ReturnType<typeof workoutService.getById>>;
  let sessionResponse: Awaited<ReturnType<typeof workoutSessionService.getLatestCompletedByWorkoutId>>;

  try {
    [workout, sessionResponse] = await Promise.all([workoutService.getById(workoutId, user.userId), workoutSessionService.getLatestCompletedByWorkoutId(workoutId, user.userId)]);
  } catch (error: unknown) {
    console.error('Failed to load workout details:', error);

    return (
      <main>
        <ErrorMessage title="Unable to load workout" message="Something went wrong while loading your workout. Please try again later." />
      </main>
    );
  }

  const session = sessionResponse;

  let previousSessions: WorkoutSessionViewModel[] = [];

  if (session?.finishedAt) {
    try {
      previousSessions = await workoutSessionService.getPreviousCompletedSessions(user.userId, session.id, new Date(session.finishedAt));
    } catch (error: unknown) {
      console.error('Failed to load previous workout sessions:', error);
    }
  }

  return (
    <div className="container">
      <WorkoutDetails workout={workout.workout} session={session} previousSessions={previousSessions} />
    </div>
  );
}
