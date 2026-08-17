import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';
import WorkoutService from '@/services/workout-service';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWorkout({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const response = await WorkoutService.getById(Number(id));
  if (!response.success) {
    notFound();
  }

  const workout = response.data.workout;
  const exericses = response.data.exericses;

  return (
    <div className="container">
      <EditWorkoutForm workout={workout} exericses={exericses} />
    </div>
  );
}
