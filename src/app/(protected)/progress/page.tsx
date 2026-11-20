import ExerciseProgress from '@/components/progress/progress-exercise';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import ProgressService from '@/services/progress-service';

export default async function ProgressPage() {
  const user = await requireAuth();

  const progressService = new ProgressService();

  let exerciseProgress: Awaited<ReturnType<typeof progressService.getProgress>>['exerciseProgress'];

  try {
    const response = await progressService.getProgress(user.userId);
    exerciseProgress = response.exerciseProgress;
  } catch (error: unknown) {
    console.error('Failed to load exercise progress:', error);

    return (
      <PageContainer>
        <ErrorMessage title="Unable to load progress" message="We couldn't retrieve your exercise progress. Please try again later." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header title="YOUR TRAINING" subTitle="Progress" description="Track your progress. Reach your goals. Keep track of your workouts, monitor your progress, and stay focused on your fitness goals." />

      <section>
        <div className="border-border mb-5 border-b pb-4">
          <h2 className="text-text text-lg font-semibold">Training and Personal Records</h2>

          <p className="text-text-secondary mt-1 text-sm leading-6">Track your exercise progress, compare results, and monitor your personal records over time.</p>
        </div>

        <ExerciseProgress exerciseProgress={exerciseProgress} metric="weight" />
      </section>
    </PageContainer>
  );
}
