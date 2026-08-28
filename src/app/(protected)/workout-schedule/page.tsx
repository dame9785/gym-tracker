import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { getTokenFromCookieStore } from '@/lib/auth';
import WorkoutService from '@/services/workout-service';
import { redirect } from 'next/navigation';

export default async function WorkoutSchedulePage() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }
  const response = await WorkoutService.getAll(userToken, 3);
  console.log(response);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
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
