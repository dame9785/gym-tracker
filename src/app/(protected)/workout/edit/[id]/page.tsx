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
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const { id } = await params;
  if (!id) {
    throw new Error('Something went wrong');
  }

  const response = await workoutService.getById(Number(id), user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const workout = response.data.workout;
  const exericses = response.data.exericses;

  return (
    <div className="container">
      <EditWorkoutForm workout={workout} exericses={exericses} />
    </div>
  );
}
