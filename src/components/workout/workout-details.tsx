//Typees
import type { EditWorkoutViewModel } from '@/types/workout-types';

//Components
import ExerciseCard from './exercise-card';
import StartWorkoutButton from './start-workout-button';

interface WorkoutDetailsProps {
  workout: EditWorkoutViewModel;
}

export default function WorkoutDetails({ workout }: WorkoutDetailsProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">{workout.name}</h1>

      {workout.description && <p className="mt-2 text-zinc-400">{workout.description}</p>}

      <div className="mt-8 space-y-4">
        {workout.workoutExercises.map((exercise, index) => (
          <ExerciseCard key={`${exercise.exerciseId}-${index}`} exercise={exercise} />
        ))}
      </div>

      <StartWorkoutButton workoutId={workout.id} />
    </div>
  );
}
