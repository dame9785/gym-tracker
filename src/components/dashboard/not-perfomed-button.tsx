'use client';

import { toast } from 'sonner';
import WorkoutSessionService from '@/services/workout-session-service';

type Props = {
  workoutSessionId: number;
};

export default function NotPerformedButton({ workoutSessionId }: Props) {
  const toastError = (message: string): void => {
    toast.error(message);
    return;
  };

  const setNotPerfomed = async (): Promise<void> => {
    try {
      const resposnse = await WorkoutSessionService.setNotPerformed(workoutSessionId);
      if (!resposnse.success) {
        toastError('Something went wrong, workoutSession not updated');
        return;
      }

      toast.success('Workout updated', {
        duration: 1000,
        onAutoClose: () => {
          location.href = '/dashboard';
        },
      });
    } catch (error) {
      toastError('Something went wrong, workoutSession not updated');
    }
  };

  return (
    <button
      onClick={setNotPerfomed}
      className="inline-flex
      h-11
      min-w-33
      items-center
      justify-center
      rounded-xl
      border border-red-700
      bg-red-800/60
      px-5
      text-sm
      font-semibold
      text-red-300
      transition-all duration-200
      hover:border-red-600
      hover:bg-red-800
      hover:text-white
      cursor-pointer"
    >
      Set not perfomed
    </button>
  );
}
