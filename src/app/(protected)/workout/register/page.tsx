import RegisterWorkoutForm from '@/components/forms/workout/register-workout-form';
import { getTokenFromCookieStore } from '@/lib/auth';
import ExerciseService from '@/services/exercise-service';
import { notFound, redirect } from 'next/navigation';

export default async function RegisterWorkout() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const response = await ExerciseService.getAll(userToken);
  if (!response.success) {
    throw new Error('Something went wrong');
  }

  return (
    <div className="container">
      <RegisterWorkoutForm exericses={response.data} userToken={userToken} />
    </div>
  );
}
