import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';
import WorkoutService from '@/services/workout-service';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWorkout({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    throw new Error('Something went wrong');
  }

  const response = await WorkoutService.getById(Number(id));
  if (!response.success) {
    throw new Error('Something went wrong');
  }

  const workout = response.data.workout;
  const exericses = response.data.exericses;

  return (
    <div className="container">
      <EditWorkoutForm workout={workout} exericses={exericses} />
    </div>
  );
}
