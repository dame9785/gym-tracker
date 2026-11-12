import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import ErrorMessage from '@/components/ui/error-message';

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
      <main>
        <ErrorMessage title="Unable to load workouts" message="Something went wrong while loading your workouts. Please try again later." />
      </main>
    );
  }

  return (
    <div className="container">
      <ScheduleWorkoutForm workouts={workoutData.workouts} />
    </div>
  );
}
