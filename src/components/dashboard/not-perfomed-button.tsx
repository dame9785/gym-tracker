'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  workoutSessionId: number;
};

export default function NotPerformedButton({ workoutSessionId }: Props) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const setNotPerformed = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/workout-sessions/${workoutSessionId}/status`, { method: 'PUT' });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Could not update workout. Please try again.');
        return;
      }

      toast.success('Workout updated');

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to update workout status:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={setNotPerformed}
      disabled={isUpdating}
      className="
        inline-flex h-11 min-w-33 items-center justify-center
        rounded-xl border border-red-700 bg-red-800/60 px-5
        text-sm font-semibold text-red-300
        transition-all duration-200
        hover:border-red-600 hover:bg-red-800 hover:text-white
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {isUpdating ? 'Updating...' : 'Set Not Performed'}
    </button>
  );
}
