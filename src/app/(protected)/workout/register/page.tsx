import RegisterWorkoutForm from '@/components/forms/workout/register-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

import { ExerciseService } from '@/services-server/exercise-service';

const exerciseService = new ExerciseService();
export default async function RegisterWorkout() {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const response = await exerciseService.getAllExersise(user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  return (
    <div className="container">
      <RegisterWorkoutForm exericses={response.data} />
    </div>
  );
}
