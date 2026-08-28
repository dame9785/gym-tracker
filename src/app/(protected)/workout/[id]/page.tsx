import { redirect } from 'next/navigation';

// Components
import WorkoutDetails from '@/components/workout/workout-details';

// Services
import WorkoutService from '@/services/workout-service';
import { getTokenFromCookieStore } from '@/lib/auth';
import ErrorMessage from '@/components/ui/error-message';

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

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const workout = response.data.workout;

  return (
    <div className="container">
      <WorkoutDetails workout={workout} />
    </div>
  );
}
