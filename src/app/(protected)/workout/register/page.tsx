import RegisterWorkoutForm from '@/components/forms/workout/register-workout-form';
import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services/exercise-service';

import type { ExerciseViewModel } from '@/types/exercise-types';

const exerciseService = new ExerciseService();

export default async function RegisterWorkout(): Promise<React.ReactElement> {
  const user = await requireAuth();

  let exercises: ExerciseViewModel[];

  try {
    exercises = await exerciseService.getAllExersise(user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong while loading your exercises.';

    return (
      <PageContainer>
        <ErrorMessage title="Unable to load exercises" message={message} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="Workout library"
        subTitle="Create workout"
        description="Create a workout by adding exercises, sets, reps and weights."
        actions={[
          {
            label: 'Back to workouts',
            href: '/workout',
            variant: 'secondary',
          },
        ]}
      />

      <RegisterWorkoutForm exericses={exercises} />
    </PageContainer>
  );
}
