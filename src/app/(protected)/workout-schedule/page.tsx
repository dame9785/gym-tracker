import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
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
  if (!response.success) {
    throw new Error('Something went wrong');
  }

  const workouts = response.data.workouts;

  return (
    <div className="container">
      <ScheduleWorkoutForm workouts={workouts} />
    </div>
  );
}
