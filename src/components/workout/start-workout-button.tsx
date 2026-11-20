'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { createWorkoutSessionAction } from '@/actions/workout-session-actions';
import Button from '@/components/button/button';

interface StartWorkoutButtonProps {
  workoutId: number;
  workoutScheduleId?: number;
  activeSessionId?: number | null;
}

export default function StartWorkoutButton({ workoutId, workoutScheduleId, activeSessionId }: StartWorkoutButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartWorkout = async () => {
    if (isStarting) return;

    setIsStarting(true);

    if (activeSessionId) {
      router.push(`/workout-sessions/${activeSessionId}`);
      return;
    }

    try {
      const result = await createWorkoutSessionAction(workoutId, workoutScheduleId);

      if (!result.success || !result.data) {
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
    <Button variant="primary" size="md" onClick={handleStartWorkout} loading={isStarting} disabled={isStarting}>
      {isStarting ? 'Starting...' : 'Start Workout'}
    </Button>
  );
}
