import type { ExerciseViewModel } from '@/types/exercise-types';
import ExerciseCard from '@/components/exericses/exercise-card';
import EmptyState from '@/components/ui/empty-state';

type Props = {
  exercises: ExerciseViewModel[];
};

export default function Exercises({ exercises }: Props) {
  if (exercises.length === 0) {
    return <EmptyState title="No exercises yet" description="Add your first exercise to get started." />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
