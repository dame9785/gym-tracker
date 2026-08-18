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
      className="      inline-flex
      h-11
      min-w-[132px]
      items-center
      justify-center
      rounded-xl
      border border-zinc-700
      bg-orange-700
      cursor-pointer
      px-5
      text-sm
      font-semibold
      text-zinc-300
      transition-all duration-200
      hover:border-zinc-600
      hover:bg-zinc-800
      hover:text-white
    "
    >
      {isStarting ? 'Startar...' : 'Starta workout'}
    </button>
  );
}
