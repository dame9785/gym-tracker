import RegisterWorkoutForm from '@/components/forms/workout/register-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import type { ExerciseListResult } from '@/types/exercise-types';

const exerciseService = new ExerciseService();

export default async function RegisterWorkout(): Promise<React.ReactElement> {
  const user = await requireAuth();

  let exercises: ExerciseListResult;

  try {
    exercises = await exerciseService.getAllExersise(user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong while loading your exercises.';

    return (
      <main>
        <ErrorMessage title="Unable to load exercises" message={message} />
      </main>
    );
  }

  return (
    <div className="container">
      <RegisterWorkoutForm exericses={exercises} />
    </div>
  );
}
