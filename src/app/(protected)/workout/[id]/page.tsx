import { notFound } from 'next/navigation';

// Components
import WorkoutDetails from '@/components/workout/workout-details';

// Services
import { WorkoutService } from '@/services-server/workout-service';

const workoutService = new WorkoutService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPage({ params }: PageProps) {
  const { id } = await params;

  const workoutId = Number(id);

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    notFound();
  }

  const result = await workoutService.getById(workoutId);

  if (!result.success || !result.workout) {
    notFound();
  }

  return (
    <div className="container">
      <WorkoutDetails workout={result.workout} />
    </div>
  );
}
