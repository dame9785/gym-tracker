'use client';

import { Dumbbell, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { deleteExerciseAction } from '@/actions/exercise-actions';

// Types
import type { ExerciseViewModel } from '@/types/exercise-types';

type Props = {
  exercises: ExerciseViewModel[];
};

export default function ExerciseTable({ exercises }: Props) {
  const router = useRouter();

  // Handle delete
  const handleDelete = (id: number) => {
    verifyDelete(id);
  };

  // Verify delete
  const verifyDelete = (id: number): void => {
    toast('Are you sure you want to delete the exercise?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeExercise(id);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Remove exercise
  const removeExercise = async (id: number) => {
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
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Exericse</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Muscle group</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Equipment</th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Measures</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id} className="group border-b border-zinc-800/70 transition-all duration-200 last:border-b-0 hover:bg-zinc-800/40">
              {/* Exercise */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-orange-500/10
                      text-orange-400
                      transition-all duration-200
                      group-hover:bg-orange-500/15
                      group-hover:scale-105
                    "
                  >
                    <Dumbbell className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-100">{exercise.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-600">Exercise #{exercise.id}</p>
                  </div>
                </div>
              </td>

              {/* Muscle group */}
              <td className="px-6 py-5">
                <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  {exercise.muscleGroup}
                </span>
              </td>

              {/* Equipment */}
              <td className="px-6 py-5">
                <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-1 text-xs font-mediumtext-zinc-400">
                  {exercise.equipment}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex justify-end gap-2">
                  {/* Edit */}
                  <Link
                    href={`/exercise/${exercise.id}`}
                    aria-label={`Redigera ${exercise.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(exercise.id)}
                    aria-label={`Radera ${exercise.name}`}
                    className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700bg-zinc-800/70 text-zinc-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
