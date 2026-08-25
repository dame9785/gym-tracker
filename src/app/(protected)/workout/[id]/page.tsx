import { redirect } from 'next/navigation';

// Components
import WorkoutDetails from '@/components/workout/workout-details';

// Services
import WorkoutService from '@/services/workout-service';
import { getTokenFromCookieStore } from '@/lib/auth';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPage({ params }: PageProps) {
  const { id } = await params;

  const userToken = await getTokenFromCookieStore();
  if (!userToken) {
    redirect('/account/login');
  }

  const workoutId = Number(id);
  const response = await WorkoutService.getById(workoutId, userToken);

  if (!response.success) {
    throw new Error('Something went wrong');
  }

  const workout = response.data.workout;

  return (
    <div className="container">
      <WorkoutDetails workout={workout} />
    </div>
  );
}
