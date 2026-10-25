'use client';

import Image from 'next/image';
import { Activity, Dumbbell, FileText, ListChecks, Lightbulb, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import type { ExerciseViewModel } from '@/types/exercise-types';
import { useEffect } from 'react';

type Props = {
  exercise: ExerciseViewModel;
  onClose: () => void;
};

export default function ExerciseDetailsModal({ exercise, onClose }: Props) {
  function formatInstructions(instructions: string): string[] {
    return instructions
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean)
      .map((step) => step.replace(/^\d+[.)]\s*/, ''));
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50"
      >
        {/* Header image */}
        <div className="relative h-48 shrink-0 bg-zinc-900 sm:h-64">
          <Image src={exercise.imagePath || '/placeholder.png'} alt={exercise.name} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-black/20" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exercise details"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:border-orange-400 hover:bg-orange-500/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <span className="mb-2 inline-flex rounded-full border border-orange-400/30 bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300 backdrop-blur-sm">
              {exercise.primaryMuscle}
            </span>

            <h2 id="exercise-modal-title" className="text-2xl font-bold text-white sm:text-3xl">
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-5 sm:p-7">
          {/* Quick information */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                <Dumbbell className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Equipment</span>
              </div>

              <p className="text-sm font-medium text-white">{exercise.equipment || 'Bodyweight'}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Muscle groups</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles.length > 0 ? (
                  exercise.secondaryMuscles.map((muscle) => (
                    <span key={muscle} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">
                      {muscle}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-zinc-400">No secondary muscles</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-white">Description</h3>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">{exercise.description || 'No description available.'}</p>
          </section>

          {/* Instructions */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-white">Instructions</h3>
            </div>

            {exercise.instructions ? (
              <ol className="space-y-3">
                {formatInstructions(exercise.instructions).map((step, index) => (
                  <li key={`${index}-${step}`} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-xs font-bold text-orange-400">{index + 1}</span>

                    <p className="whitespace-pre-line pt-1 text-sm leading-6 text-zinc-300">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-zinc-500">No instructions available.</p>
            )}
          </section>

          {/* Technique tips */}
          {exercise.techniqueTips && (
            <section className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-amber-300">Technique tips</h3>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">{exercise.techniqueTips}</p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:justify-end sm:px-6">
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800">
            Close
          </button>

          <Link
            href={`/exercise/${exercise.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            <Pencil className="h-4 w-4" />
            Edit exercise
          </Link>
        </div>
      </section>
    </div>
  );
}
