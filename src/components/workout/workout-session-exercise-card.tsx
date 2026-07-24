'use client';

import { WorkoutSessionExerciseViewModel } from '@/view-models/workout-session-exercise-view-model';
import { useState } from 'react';
import WorkoutSessionSetCard from './workout-session-set-card';

interface WorkoutSessionExerciseCardProps {
  exercise: WorkoutSessionExerciseViewModel;
}

export default function WorkoutSessionExerciseCard({ exercise }: WorkoutSessionExerciseCardProps) {
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-2xl font-bold">
        {exercise.order}. {exercise.name}
      </h2>

      <p className="mt-2 text-zinc-400">{exercise.sets.length} set</p>

      <div className="mt-6 space-y-2">
        {exercise.sets.map((set) => (
          <WorkoutSessionSetCard key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}
