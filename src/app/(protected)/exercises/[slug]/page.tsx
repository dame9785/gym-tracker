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
      <main className="text-text min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <ErrorMessage title="Unable to load exercise" message="We couldn't retrieve this exercise. Please try again later." />

          <Link href="/exercises" className="text-primary hover:text-primary-hover mt-5 inline-flex items-center gap-2 text-sm transition">
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
    <main className="text-text min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Back navigation */}
        <Link href="/exercises" className="text-text-muted hover:text-primary mb-6 inline-flex items-center gap-2 text-sm font-medium transition">
          <ArrowLeft className="h-4 w-4" />
          Back to exercises
        </Link>

        <article className="border-border from-surface to-background overflow-hidden rounded-2xl border bg-gradient-to-b shadow-2xl shadow-black/20">
          {/* Hero image */}
          <div className="bg-surface relative h-64 sm:h-80 lg:h-[420px]">
            <Image src={exercise.imagePath || '/placeholder.png'} alt={exercise.name} fill priority sizes="(max-width: 768px) 100vw, 1152px" className="object-cover" />

            <div className="from-background absolute inset-0 bg-gradient-to-t via-black/20 to-black/10" />

            <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-8">
              <span className="border-info/40 bg-info/15 text-info mb-3 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">{exercise.primaryMuscle}</span>

              <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{exercise.name}</h1>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* Muscle groups */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Activity className="text-primary h-5 w-5" />

                <h2 className="text-text text-lg font-semibold">Muscle groups</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Primary muscle */}
                <div className="border-info/20 bg-info/5 rounded-xl border p-5">
                  <p className="text-info mb-4 text-xs font-bold tracking-wider uppercase">Primary muscle</p>

                  <span className="border-info/50 bg-info/15 text-text mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-lg shadow-black/20 backdrop-blur-md">
                    <Activity className="text-info h-4 w-4" />
                    {exercise.primaryMuscle}
                  </span>
                </div>

                {/* Secondary muscles */}
                <div className="border-info/20 bg-info/5 rounded-xl border p-5">
                  <p className="text-info mb-4 text-xs font-bold tracking-wider uppercase">Secondary muscles</p>

                  {exercise.secondaryMuscles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {exercise.secondaryMuscles.map((muscle) => (
                        <span key={muscle} className="border-info/40 bg-info/15 text-text hover:border-info/70 hover:bg-info/25 mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm shadow-black/20 transition-colors">
                          <Activity className="text-info h-4 w-4" />
                          {muscle}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm">No secondary muscles specified.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />

                <h2 className="text-text text-lg font-semibold">Description</h2>
              </div>

              <div className="border-border bg-surface/50 rounded-xl border p-5">
                <p className="text-text-secondary text-sm leading-7 whitespace-pre-line sm:text-base">{exercise.description || 'No description available.'}</p>
              </div>
            </section>

            {/* Instructions */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="text-primary h-5 w-5" />

                <h2 className="text-text text-lg font-semibold">How to perform</h2>
              </div>

              {instructions.length > 0 ? (
                <ol className="space-y-3">
                  {instructions.map((step, index) => (
                    <li key={`${index}-${step}`} className="border-border bg-surface/50 hover:border-border-hover flex items-start gap-4 rounded-xl border p-4 transition">
                      <span className="border-primary/20 bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold">{index + 1}</span>

                      <p className="text-text-secondary pt-1 text-sm leading-6">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="border-border bg-surface/50 rounded-xl border p-5">
                  <p className="text-text-muted text-sm">No instructions available for this exercise yet.</p>
                </div>
              )}
            </section>

            {/* Technique tips */}
            {exercise.techniqueTips && (
              <section className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="text-warning h-5 w-5" />

                  <h2 className="text-text text-lg font-semibold">Technique tips</h2>
                </div>

                <div className="border-warning/20 bg-warning/5 rounded-xl border p-5">
                  <p className="text-text-secondary text-sm leading-7 whitespace-pre-line">{exercise.techniqueTips}</p>
                </div>
              </section>
            )}

            {/* Equipment */}
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <Dumbbell className="text-primary h-5 w-5" />

                <h2 className="text-text text-lg font-semibold">Equipment</h2>
              </div>

              <div className="border-border bg-surface/50 flex items-center gap-3 rounded-xl border p-5">
                <div className="border-primary/20 bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl border">
                  <Dumbbell className="text-primary h-5 w-5" />
                </div>

                <div>
                  <p className="text-text font-semibold">{exercise.equipment || 'Bodyweight'}</p>

                  <p className="text-text-muted mt-1 text-xs">Required equipment for this exercise</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Link href="/exercises" className="border-border-hover text-text-secondary hover:border-border-hover hover:bg-surface-hover inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition">
                <ArrowLeft className="h-4 w-4" />
                Back to exercises
              </Link>

              <Link href={`/exercises/edit/${exercise.slug ?? exercise.id}`} className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition">
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
