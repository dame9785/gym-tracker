import { notFound, redirect } from 'next/navigation';

import ErrorMessage from '@/components/ui/error-message';
import WorkoutSession from '@/components/workout/workout-session';

import { WorkoutSessionService } from '@/services/workout-session-service';
import { requireAuth } from '@/lib/auth';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireAuth();

  const sessionId = Number(id);

  if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
    notFound();
  }

  const workoutSessionService = new WorkoutSessionService();

  let workoutSession: Awaited<ReturnType<typeof workoutSessionService.getById>>;

  try {
    workoutSession = await workoutSessionService.getById(sessionId, user.userId);
  } catch (error: unknown) {
    console.error('Failed to load workout session:', error);

    return (
      <main>
        <ErrorMessage title="Unable to load workout session" message="Something went wrong while loading your workout session. Please try again later." />
      </main>
    );
  }

  // Only active sessions may be displayed in the workout view.
  if (workoutSession.status !== 'ACTIVE') {
    redirect('/dashboard');
  }

  return <WorkoutSession workoutSession={workoutSession} />;
}
