//Components
import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const exericseService = new ExerciseService();

export default async function EditExercises({ params }: PageProps) {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const { id } = await params;

  const response = await exericseService.getById(Number(id), user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const exericse = response.data;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <EditExerciseForm exericse={exericse} />
      </div>
    </div>
  );
}
