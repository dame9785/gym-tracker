import Image from 'next/image';
import Link from 'next/link';
import { Activity, ArrowLeft, Dumbbell, FileText, Lightbulb, ListChecks, Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';

import ErrorMessage from '@/components/ui/error-message';

import { ExerciseService } from '@/services/exercise-service';
import { requireAuth } from '@/lib/auth';

import type { ExerciseViewModel } from '@/types/exercise-types';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExerciseDetailsPage({ params }: PageProps) {
  const user = await requireAuth();
  const { slug } = await params;

  const exerciseService = new ExerciseService();

  let exercise: ExerciseViewModel;

  try {
    exercise = await exerciseService.getBySlug(slug, user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '';

    if (message === 'Exercise not found.' || message === 'Could not find exercise.') {
      notFound();
    }

    console.error('Failed to fetch exercise:', error);

    return (
      <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <ErrorMessage title="Unable to load exercise" message="We couldn't retrieve this exercise. Please try again later." />

          <Link href="/exercises" className="mt-5 inline-flex items-center gap-2 text-sm text-orange-400 transition hover:text-orange-300">
            <ArrowLeft className="h-4 w-4" />
            Back to exercises
          </Link>
        </div>
      </main>
    );
  }

  const instructions = exercise.instructions
    ? exercise.instructions
        .split('\n')
        .map((step) => step.trim())
        .filter(Boolean)
        .map((step) => step.replace(/^\d+[.)]\s*/, ''))
    : [];

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Back navigation */}
        <Link href="/exercises" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-400">
          <ArrowLeft className="h-4 w-4" />
          Back to exercises
        </Link>

        <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl shadow-black/20">
          {/* Hero image */}
          <div className="relative h-64 bg-zinc-900 sm:h-80 lg:h-[420px]">
            <Image src={exercise.imagePath || '/placeholder.png'} alt={exercise.name} fill priority sizes="(max-width: 768px) 100vw, 1152px" className="object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-black/10" />

            <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-8">
              <span className="mb-3 inline-flex items-center rounded-full border border-blue-400/40 bg-blue-950/90 px-3 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-sm">{exercise.primaryMuscle}</span>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{exercise.name}</h1>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* Muscle groups */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-400" />

                <h2 className="text-lg font-semibold text-white">Muscle groups</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Primary muscle */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
                  <p className="mb-4 text-xs font-bold tracking-wider text-blue-300 uppercase">Primary muscle</p>

                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-950/90 px-4 py-2 text-sm font-semibold text-blue-100 shadow-lg shadow-black/20 backdrop-blur-md">
                    <Activity className="h-4 w-4 text-blue-300" />
                    {exercise.primaryMuscle}
                  </span>
                </div>

                {/* Secondary muscles */}
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-5">
                  <p className="mb-4 text-xs font-bold tracking-wider text-violet-300 uppercase">Secondary muscles</p>

                  {exercise.secondaryMuscles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {exercise.secondaryMuscles.map((muscle) => (
                        <span key={muscle} className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200 shadow-sm shadow-violet-950/20 transition-colors hover:border-violet-400/70 hover:bg-violet-500/25">
                          <Activity className="h-4 w-4 text-violet-300" />
                          {muscle}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No secondary muscles specified.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-400" />

                <h2 className="text-lg font-semibold text-white">Description</h2>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <p className="text-sm leading-7 whitespace-pre-line text-zinc-300 sm:text-base">{exercise.description || 'No description available.'}</p>
              </div>
            </section>

            {/* Instructions */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-orange-400" />

                <h2 className="text-lg font-semibold text-white">How to perform</h2>
              </div>

              {instructions.length > 0 ? (
                <ol className="space-y-3">
                  {instructions.map((step, index) => (
                    <li key={`${index}-${step}`} className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-sm font-bold text-orange-400">{index + 1}</span>

                      <p className="pt-1 text-sm leading-6 text-zinc-300">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <p className="text-sm text-zinc-500">No instructions available for this exercise yet.</p>
                </div>
              )}
            </section>

            {/* Technique tips */}
            {exercise.techniqueTips && (
              <section className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />

                  <h2 className="text-lg font-semibold text-white">Technique tips</h2>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
                  <p className="text-sm leading-7 whitespace-pre-line text-zinc-300">{exercise.techniqueTips}</p>
                </div>
              </section>
            )}

            {/* Equipment */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-orange-400" />

                <h2 className="text-lg font-semibold text-white">Equipment</h2>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <Dumbbell className="h-5 w-5 text-orange-400" />
                </div>

                <div>
                  <p className="font-semibold text-white">{exercise.equipment || 'Bodyweight'}</p>

                  <p className="mt-1 text-xs text-zinc-500">Required equipment for this exercise</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
              <Link href="/exercises" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800">
                <ArrowLeft className="h-4 w-4" />
                Back to exercises
              </Link>

              <Link href={`/exercises/edit/${exercise.slug ?? exercise.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400">
                <Pencil className="h-4 w-4" />
                Edit exercise
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
