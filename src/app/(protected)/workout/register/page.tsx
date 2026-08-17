import RegisterWorkoutForm from '@/components/forms/workout/register-workout-form';
import ExerciseService from '@/services/exercise-service';
import { notFound } from 'next/navigation';

export default async function RegisterWorkout() {
  const response = await ExerciseService.getAll();

  if (!response.success) {
    notFound();
  }

  return (
    <div className="container">
      <RegisterWorkoutForm exericses={response.data.exercises} />
    </div>
  );
}
