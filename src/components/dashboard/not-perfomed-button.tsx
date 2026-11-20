'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { setWorkoutSessionNotPerformedAction } from '@/actions/workout-session-actions';
import Button from '@/components/button/button';

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
      const result = await setWorkoutSessionNotPerformedAction(workoutSessionId);

      if (!result.success) {
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
    <Button type="button" variant="danger" size="md" onClick={setNotPerformed} loading={isUpdating} disabled={isUpdating} className="h-11 min-w-33">
      {isUpdating ? 'Updating...' : 'Set Not Performed'}
    </Button>
  );
}
