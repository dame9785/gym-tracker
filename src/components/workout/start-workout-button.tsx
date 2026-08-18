'use client';

import WorkoutSessionService from '@/services/workout-session-service';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface StartWorkoutButtonProps {
  workoutId: number;
  userToken: string;
}

export default function StartWorkoutButton({ workoutId, userToken }: StartWorkoutButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartWorkout = async () => {
    setIsStarting(true);
    try {
      const response = await WorkoutSessionService.create(workoutId);
      if (!response.success) {
        toast.error('Något gick fel, gick inte starta träningspasset');
        return;
      }
      toast.success('Träningspass startad');
      router.push(`/workout-sessions/${response.data.workoutSessionId}`);
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
