import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import { WorkoutService } from '@/services/workout-service';

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
      <PageContainer>
        <ErrorMessage title="Unable to load workout" message="Invalid workout ID." />
      </PageContainer>
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
      <PageContainer>
        <ErrorMessage title="Unable to load workout" message="Something went wrong while loading your workout." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="Workout library"
        subTitle="Edit workout"
        description="Update the exercises, sets, reps and weights in your workout."
        actions={[
          {
            label: 'Back to workouts',
            href: '/workout',
            variant: 'secondary',
          },
        ]}
      />

      <EditWorkoutForm workout={workoutData.workout} exericses={workoutData.exercises} />
    </PageContainer>
  );
}
