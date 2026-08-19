import WorkoutSession from '@/components/workout/workout-session';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { notFound } from 'next/navigation';

const workoutSessionService = new WorkoutSessionService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;
  const response = await workoutSessionService.getById(Number(id));

  if (!response.success) {
    notFound();
  }

  const workoutSession = response.data.workoutSession;
  return <WorkoutSession workoutSession={workoutSession} />;
}
