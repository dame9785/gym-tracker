import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import { WorkoutService } from '@/services/workout-service';

export default async function WorkoutSchedulePage() {
  const user = await requireAuth();

  const workoutService = new WorkoutService();

  let workoutData: Awaited<ReturnType<typeof workoutService.getAll>>;

  try {
    workoutData = await workoutService.getAll(1, user.userId);
  } catch (error: unknown) {
    console.error('Failed to load workouts for scheduling:', error);

    return (
      <PageContainer>
        <ErrorMessage title="Unable to load workouts" message="Something went wrong while loading your workouts. Please try again later." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="Workout planning"
        subTitle="Schedule workout"
        description="Choose a workout and a date to add it to your training schedule."
        actions={[
          {
            label: 'Back to workouts',
            href: '/workout',
            variant: 'secondary',
          },
        ]}
      />

      <ScheduleWorkoutForm workouts={workoutData.workouts} />
    </PageContainer>
  );
}
