'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface StartWorkoutButtonProps {
  workoutId: number;
}

export default function StartWorkoutButton({ workoutId }: StartWorkoutButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartWorkout = async () => {
    if (isStarting) return;

    setIsStarting(true);

    try {
      const response = await fetch('/api/workout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workoutId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Could not start workout. Please try again.');
        return;
      }

      toast.success('Workout started!');
      router.push(`/workout-sessions/${result.data}`);
    } catch (error) {
      console.error('Failed to start workout:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStartWorkout}
      disabled={isStarting}
      className="
        inline-flex h-11 min-w-[132px]
        items-center justify-center
        rounded-xl border border-zinc-700
        bg-orange-700 px-5
        text-sm font-semibold text-zinc-300
        transition-all duration-200
        hover:border-zinc-600 hover:bg-zinc-800 hover:text-white
        disabled:cursor-not-allowed disabled:opacity-60
      "
    >
      {isStarting ? 'Starting...' : 'Start Workout'}
    </button>
  );
}
