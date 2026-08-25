import WorkoutSession from '@/components/workout/workout-session';
import { getTokenFromCookieStore } from '@/lib/auth';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { redirect } from 'next/navigation';

const workoutSessionService = new WorkoutSessionService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;

  const userToken = await getTokenFromCookieStore();
  if (!userToken) {
    redirect('/account/login');
  }
  const response = await workoutSessionService.getById(Number(id));
  console.log(response);

  if (!response.success) {
    throw new Error('Something went wrong');
  }

  const workoutSession = response.data;
  return <WorkoutSession workoutSession={workoutSession} />;
}
