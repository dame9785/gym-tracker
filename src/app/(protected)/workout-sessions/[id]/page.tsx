import ErrorMessage from '@/components/ui/error-message';
import WorkoutSession from '@/components/workout/workout-session';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { requireAuth } from '@/lib/auth';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const workoutSessionService = new WorkoutSessionService();

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;

  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const sessionId = Number(id);

  if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
    return (
      <main>
        <ErrorMessage title="Invalid workout session" message="The workout session ID is invalid." />
      </main>
    );
  }

  let workoutSession: Awaited<ReturnType<typeof workoutSessionService.getById>> | null = null;

  try {
    workoutSession = await workoutSessionService.getById(sessionId, user.userId);
  } catch (error) {
    console.error('Failed to load workout session:', error);
  }

  if (!workoutSession) {
    return (
      <main>
        <ErrorMessage title="Unable to load workout session" message="Something went wrong while loading your workout session." />
      </main>
    );
  }

  return <WorkoutSession workoutSession={workoutSession} />;
}
