import EditWorkoutForm from '@/components/forms/workout/edit-workout-form';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWorkout({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="container">
      <EditWorkoutForm workoutId={id} />
    </div>
  );
}
