'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteExerciseAction } from '@/actions/exercise-actions';
import type { ExerciseViewModel } from '@/types/exercise-types';

type Props = {
  exercise: ExerciseViewModel;
};

export default function ExericseCard({ exercise }: Props) {
  const router = useRouter();

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
    <article
      key={exercise.id}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-950/10"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        <Image
          src={exercise.imagePath || '/placeholder.png'}
          alt={exercise.name}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, (max-width: 1535px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

        {/* Primary muscle group */}
        <div className="absolute left-3 top-3 max-w-[80%]">
          <span className="inline-block rounded-full border border-blue-500/40 bg-blue-950/80 px-3 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm">
            {exercise.primaryMuscle}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h2 className="truncate text-lg font-bold text-white" title={exercise.name}>
          {exercise.name}
        </h2>

        {/* Secondary muscle groups */}
        {exercise.secondaryMuscles.length > 0 && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
            <span className="font-medium text-zinc-300">Secondary:</span> {exercise.secondaryMuscles.join(', ')}
          </p>
        )}

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{exercise.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Equipment */}
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-xs font-medium text-zinc-300">
            <Dumbbell className="h-4 w-4 shrink-0 text-orange-400" />
            <span className="truncate">{exercise.equipment || 'Bodyweight'}</span>
          </span>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/exercise/${exercise.id}`}
              aria-label={`Edit ${exercise.name}`}
              title="Edit exercise"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-300 transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
            >
              <Pencil className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(exercise.id)}
              aria-label={`Delete ${exercise.name}`}
              title="Delete exercise"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
