'use client';

import { useRouter } from 'next/navigation';
import { WorkoutSessionService } from '@/services/workout-session-service';
import { WorkoutSessionViewModel } from '@/view-models/workout-session-view-model';
import WorkoutSessionExerciseCard from './workout-session-exercise-card';

interface WorkoutSessionProps {
  workoutSession: WorkoutSessionViewModel;
}

export default function WorkoutSession({ workoutSession }: WorkoutSessionProps) {
  const router = useRouter();
  const workoutSessionService = new WorkoutSessionService();

  const handleFinishWorkout = async () => {
    const confirmed = confirm('Är du säker på att du vill avsluta träningspasset?');

    if (!confirmed) {
      return;
    }

    const result = await workoutSessionService.finish(workoutSession.id);

    if (result.success) {
      router.push('/dashboard');
    }
  };
  return (
    <div className="container">
      <h1 className="text-4xl font-bold">Workout Session #{workoutSession.id}</h1>

      <div className="mt-8 space-y-4">
        {workoutSession.exercises.map((exercise) => (
          <WorkoutSessionExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleFinishWorkout}
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
