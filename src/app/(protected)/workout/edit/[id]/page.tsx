import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWorkout({ params }: PageProps) {
  const { id } = await params;

  const workoutId = Number(id);

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    // senare kan vi använda notFound()
    return null;
  }

  return (
    <div className="container">
      <EditWorkoutForm workoutId={workoutId} />
    </div>
  );
}
