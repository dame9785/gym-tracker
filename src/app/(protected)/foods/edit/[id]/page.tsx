//Components
import EditFoodForm from '@/components/forms/food/edit-food-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { FoodService } from '@/services-server/food-service';
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const foodService = new FoodService();

export default async function EditExercises({ params }: PageProps) {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const { id } = await params;

  const response = await foodService.getById(Number(id), user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const food = response.data;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <EditFoodForm food={food} />
      </div>
    </div>
  );
}
