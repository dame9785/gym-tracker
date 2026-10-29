import { redirect } from 'next/navigation';

// Components
import WorkoutDetails from '@/components/workout/workout-details';
import ErrorMessage from '@/components/ui/error-message';

// Services
import { WorkoutService } from '@/services-server/workout-service';
import { WorkoutSessionService } from '@/services-server/workout-session-service';

// Auth
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
    redirect('/workouts');
  }

  const workoutService = new WorkoutService();
  const workoutSessionService = new WorkoutSessionService();

  const [response, sessionResponse] = await Promise.all([
    workoutService.getById(workoutId, user.userId),
    workoutSessionService.getLatestCompletedByWorkoutId(workoutId, user.userId),
  ]);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load workout" message={response.message ?? 'Something went wrong while loading your workout.'} />
      </main>
    );
  }

  const workout = response.data.workout;

  const session = sessionResponse.success && sessionResponse.data ? sessionResponse.data : null;

  let previousSessions: WorkoutSessionViewModel[] = [];

  if (session?.finishedAt) {
    const previousSessionsResponse = await workoutSessionService.getPreviousCompletedSessions(user.userId, session.id, new Date(session.finishedAt));

    if (previousSessionsResponse.success) {
      previousSessions = previousSessionsResponse.data;
    }
  }

  return (
    <div className="container">
      <WorkoutDetails workout={workout} session={session} previousSessions={previousSessions} />
    </div>
  );
}
