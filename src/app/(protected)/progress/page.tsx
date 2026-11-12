import ExerciseProgress from '@/components/progress/progress-exercise';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';

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
      <main className="mx-auto w-full max-w-7xl px-0 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ErrorMessage title="Unable to load progress" message="We couldn't retrieve your exercise progress. Please try again later." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-0 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Header title="YOUR TRAINING" subTitle="Progress" description="Track your progress. Reach your goals. Keep track of your workouts, monitor your progress, and stay focused on your fitness goals." />

      <section>
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-semibold text-white">Träning och personliga rekord</h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">Följ utvecklingen för dina övningar, jämför resultat och se dina rekord över tid.</p>
        </div>

        <ExerciseProgress exerciseProgress={exerciseProgress} metric="weight" />
      </section>
    </main>
  );
}
