import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExercises({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <EditExerciseForm exerciseId={id} />
      </div>
    </div>
  );
}
