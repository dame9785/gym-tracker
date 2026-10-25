'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Eye, Pencil, Trash2, Activity } from 'lucide-react';
import { toast } from 'sonner';

import { deleteExerciseAction } from '@/actions/exercise-actions';
import ExerciseDetailsModal from '@/components/exericse/exercise-details-modal';
import type { ExerciseViewModel } from '@/types/exercise-types';

type Props = {
  exercise: ExerciseViewModel;
};

export default function ExericseCard({ exercise }: Props) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = (id: number) => {
    toast('Are you sure you want to delete this exercise?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const response = await deleteExerciseAction(id);

            if (!response.success) {
              toast.error(response.message);
              return;
            }

            toast.success(response.message);
            router.refresh();
          } catch (error) {
            console.error('Failed to delete exercise:', error);
            toast.error('Something went wrong. Please try again.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/10">
        {/* Image */}
        <div className="relative h-52 shrink-0 overflow-hidden bg-zinc-900">
          <Image
            src={exercise.imagePath || '/placeholder.png'}
            alt={exercise.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, (max-width: 1535px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Primary muscle */}
          <div className="absolute left-3 top-3 max-w-[90%]">
            <span className="inline-flex rounded-full border border-blue-400/40 bg-blue-950/90 px-3 py-1.5 text-xs font-semibold text-blue-200 shadow-sm backdrop-blur-sm">
              {exercise.primaryMuscle}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="flex flex-1 flex-col p-5">
          <div>
            <h2 className="line-clamp-2 min-h-7 text-lg font-bold leading-snug text-white" title={exercise.name}>
              {exercise.name}
            </h2>

            <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-zinc-400">{exercise.description || 'No description available.'}</p>

            {/* Secondary muscle groups */}
            {exercise.secondaryMuscles.length > 0 && (
              <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-violet-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secondary muscles</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition-colors hover:border-violet-400/50 hover:bg-violet-500/20"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Equipment and actions */}
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-xs font-medium text-zinc-200">
                <Dumbbell className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="truncate">{exercise.equipment || 'Bodyweight'}</span>
              </span>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/exercise/${exercise.id}`}
                  aria-label={`Edit ${exercise.name}`}
                  title="Edit exercise"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-300 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(exercise.id)}
                  aria-label={`Delete ${exercise.name}`}
                  title="Delete exercise"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Details button */}
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Eye className="h-4 w-4" />
              View details
            </button>
          </div>
        </div>
      </article>

      {showDetails && <ExerciseDetailsModal exercise={exercise} onClose={() => setShowDetails(false)} />}
    </>
  );
}
