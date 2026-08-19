import { notFound } from 'next/navigation';

// Components
import WorkoutDetails from '@/components/workout/workout-details';

// Services
import WorkoutService from '@/services/workout-service';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPage({ params }: PageProps) {
  const { id } = await params;

  const workoutId = Number(id);
  const response = await WorkoutService.getById(workoutId);
  console.log(response);
  if (!response.success) {
    notFound();
  }

  const workout = response.data.workout;

  return (
    <div className="container">
      <WorkoutDetails workout={workout} />
    </div>
  );
}
