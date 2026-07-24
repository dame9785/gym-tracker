'use client';

import { WorkoutSessionViewModel } from '@/view-models/workout-session-view-model';
import WorkoutSessionExerciseCard from './workout-session-exercise-card';

interface WorkoutSessionProps {
  workoutSession: WorkoutSessionViewModel;
}

export default function WorkoutSession({ workoutSession }: WorkoutSessionProps) {
  return (
    <main className="container">
      <h1 className="text-4xl font-bold">Workout Session #{workoutSession.id}</h1>

      <div className="mt-8 space-y-4">
        {workoutSession.exercises.map((exercise) => (
          <WorkoutSessionExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </main>
  );
}
