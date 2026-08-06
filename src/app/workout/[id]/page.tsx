import WorkoutDetails from '@/components/workout/workout-details';
import { WorkoutService } from '@/services-server/workout-service';

const workoutService = new WorkoutService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPage({ params }: PageProps) {
  const { id } = await params;

  const result = await workoutService.getById(Number(id));

  if (!result.success) {
    return (
      <div className="container">
        <h1 className="text-3xl font-bold text-red-500">Workout hittades inte</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <WorkoutDetails workout={result.workout!} />
    </div>
  );
}
