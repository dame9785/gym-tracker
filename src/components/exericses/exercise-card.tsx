'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dumbbell, Eye, Pencil, Trash2, Activity } from 'lucide-react';
import { toast } from 'sonner';

import { deleteExerciseAction } from '@/actions/exercise-actions';
import Button from '@/components/button/button';
import Card from '@/components/ui/card';
import type { ExerciseViewModel } from '@/types/exercise-types';
import Link from 'next/link';

type Props = {
  exercise: ExerciseViewModel;
};

export default function ExerciseCard({ exercise }: Props) {
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
    <Card variant="interactive" padding="none" className="flex h-full flex-col">
      {/* Image */}
      <div className="group bg-surface relative h-52 shrink-0 overflow-hidden">
        <Image src={exercise.imagePath || '/placeholder.png'} alt={exercise.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, (max-width: 1535px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Primary muscle */}
        <div className="absolute top-3 left-3 max-w-[90%]">
          <span className="border-info/40 bg-info/15 text-info inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm">{exercise.primaryMuscle}</span>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <h2 className="text-text line-clamp-2 min-h-7 text-lg leading-snug font-bold" title={exercise.name}>
            {exercise.name}
          </h2>

          <p className="text-text-secondary mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6">{exercise.description || 'No description available.'}</p>

          {/* Secondary muscle groups */}
          {exercise.secondaryMuscles.length > 0 && (
            <div className="border-border bg-background/60 mt-4 rounded-xl border p-3">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="text-info h-3.5 w-3.5" />
                <p className="text-text-muted text-[10px] font-bold tracking-wider uppercase">Secondary muscles</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles.map((muscle) => (
                  <span key={muscle} className="border-info/30 bg-info/10 text-info hover:border-info/50 hover:bg-info/20 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors">
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
            {/* Equipment */}
            <span className="border-border-hover bg-surface-secondary/70 text-text-secondary inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium">
              <Dumbbell className="text-primary h-4 w-4 shrink-0" />
              <span className="truncate">{exercise.equipment || 'Bodyweight'}</span>
            </span>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <Button href={`/exercises/edit/${exercise.id}`} variant="secondary" size="sm" aria-label={`Edit ${exercise.name}`} className="flex h-10 w-10 items-center justify-center !p-0">
                <Pencil className="h-4 w-4" />
              </Button>

              <Button type="button" variant="danger" size="sm" onClick={() => handleDelete(exercise.id)} aria-label={`Delete ${exercise.name}`} className="flex h-10 w-10 items-center justify-center !p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <Link href={`/exercises/${exercise.slug}`} className="group/details border-border text-text-muted hover:text-primary mt-4 flex items-center justify-between border-t pt-3 text-sm transition-colors">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View exercise details
            </span>

            <span className="transition-transform duration-200 group-hover/details:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
