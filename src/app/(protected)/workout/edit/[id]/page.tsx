import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { WorkoutService } from '@/services-server/workout-service';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const workoutService = new WorkoutService();

export default async function EditWorkout({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const workoutId = Number(id);

  if (!Number.isSafeInteger(workoutId) || workoutId <= 0) {
    return (
      <main>
        <ErrorMessage title="Unable to load workout" message="Invalid workout ID." />
      </main>
    );
  }

  let workoutData: Awaited<ReturnType<typeof workoutService.getById>> | null = null;

  try {
    workoutData = await workoutService.getById(workoutId, user.userId);
  } catch (error) {
    console.error('Failed to load workout for editing:', error);
  }

  if (!workoutData) {
    return (
      <main>
        <ErrorMessage title="Unable to load workout" message="Something went wrong while loading your workout." />
      </main>
    );
  }

  return (
    <div className="container">
      <EditWorkoutForm workout={workoutData.workout} exericses={workoutData.exercises} />
    </div>
  );
}
