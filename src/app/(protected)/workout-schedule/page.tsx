import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { WorkoutService } from '@/services-server/workout-service';

const workoutService = new WorkoutService();

export default async function WorkoutSchedulePage() {
  const user = await requireAuth();

  let workoutData: Awaited<ReturnType<typeof workoutService.getAll>> | null = null;

  try {
    workoutData = await workoutService.getAll(1, user.userId);
  } catch (error) {
    console.error('Failed to load workouts for scheduling:', error);
  }

  if (!workoutData) {
    return (
      <main>
        <ErrorMessage title="Unable to load workouts" message="Something went wrong while loading your workouts." />
      </main>
    );
  }

  return (
    <div className="container">
      <ScheduleWorkoutForm workouts={workoutData.workouts} />
    </div>
  );
}
