'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StartWorkoutButtonProps {
  workoutId: number;
}

export default function StartWorkoutButton({ workoutId }: StartWorkoutButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartWorkout = async () => {
    setIsStarting(true);

    try {
      const response = await fetch('/api/workout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      router.push(`/workout-sessions/${result.session.id}`);
    } catch (error) {
      console.error('Kunde inte starta workout:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStartWorkout}
      disabled={isStarting}
      className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isStarting ? 'Startar...' : 'Starta workout'}
    </button>
  );
}
