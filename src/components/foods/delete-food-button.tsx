'use client';
import FoodService from '@/services/food-service';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  foodId: number;
};

const foodService = new FoodService();
export default function DeleteFoodButton({ foodId }: Props) {
  const router = useRouter();

  const confirmDelete = () => {
    if (!foodId) {
      return toast.error('Något gick fel, försök igen');
    }

    toast('Are you sure you want to delete the workout?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await handleDelete(foodId);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleDelete = async (foodId: number) => {
    try {
      const response = await foodService.delete(foodId);
      if (!response.success) {
        toast.error(response.message ?? 'Could not delete food.');
        return;
      }

      toast.success(response.message ?? 'Food deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete food:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={confirmDelete}
      aria-label="Delete food"
      title="Delete food"
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-md
        border
        border-red-500/40
        bg-red-500/10
        text-red-400
        transition-all
        duration-200
        hover:bg-red-500
        hover:text-white
        hover:shadow-[0_0_12px_rgba(239,68,68,0.4)]
        active:scale-90
        cursor-pointer
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-red-500/10
        disabled:hover:text-red-400
      "
    >
      <Trash2 size={16} />
    </button>
  );
}
