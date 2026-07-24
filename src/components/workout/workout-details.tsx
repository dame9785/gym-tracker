import { WorkoutViewModel } from '@/view-models/workout-view-model';
import ExerciseCard from './exercise-card';
import StartWorkoutButton from './start-workout-button';

interface WorkoutDetailsProps {
  workout: WorkoutViewModel;
}

export default function WorkoutDetails({ workout }: WorkoutDetailsProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">{workout.name}</h1>

      {workout.description && <p className="mt-2 text-zinc-400">{workout.description}</p>}

      <div className="mt-8 space-y-4">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard key={`${exercise.id}-${index}`} exercise={exercise} />
        ))}
      </div>

      <StartWorkoutButton workoutId={workout.id} />
    </div>
  );
}
