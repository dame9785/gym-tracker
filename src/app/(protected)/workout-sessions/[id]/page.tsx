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

  const response = await workoutSessionService.getById(Number(id), user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to workout session" message={response.message ?? 'Something went wrong while loading your workout session.'} />
      </main>
    );
  }

  const workoutSession = response.data;
  return <WorkoutSession workoutSession={workoutSession} />;
}
