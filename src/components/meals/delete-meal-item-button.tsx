'use client';

import { deleteMealItemAction } from '@/actions/meal-action';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

type DeleteButtonProps = {
  mealItemId: number;
};

export default function DeleteButton({ mealItemId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle delete
  const handleDelete = () => {
    verifyDelete();
  };

  // Verify delete
  const verifyDelete = (): void => {
    toast('Are you sure you want to delete the exercise?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeMealItem();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const removeMealItem = () => {
    startTransition(async () => {
      try {
        const response = await deleteMealItemAction(mealItemId);
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete meal item:', error);
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Ta bort vikt"
      className=" cursor-pointer flex h-9 w-9 items-center justify-center  rounded-lg border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition-all duration-20 hover:border-red-500/40  hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
