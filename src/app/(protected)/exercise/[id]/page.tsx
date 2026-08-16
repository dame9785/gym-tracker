//Components
import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';
import ExerciseService from '@/services/exercise-service';
import { notFound } from 'next/navigation';
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExercises({ params }: PageProps) {
  const { id } = await params;

  const response = await ExerciseService.getById(id);
  if (!response.success) {
    notFound();
  }

  const exericse = response.data.exercise;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <EditExerciseForm exericse={exericse} />
      </div>
    </div>
  );
}
