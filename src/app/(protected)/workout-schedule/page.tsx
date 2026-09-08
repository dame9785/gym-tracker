import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { WorkoutService } from '@/services-server/workout-service';

const workoutService = new WorkoutService();
export default async function WorkoutSchedulePage() {
  const user = await requireAuth();

  const response = await workoutService.getAll(1, user.userId);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load foods"
          message={response.message ?? 'Something went wrong while loading your foods.'}
        />
      </main>
    );
  }

  const workouts = response.data.workouts;

  return (
    <div className="container">
      <ScheduleWorkoutForm workouts={workouts} />
    </div>
  );
}
