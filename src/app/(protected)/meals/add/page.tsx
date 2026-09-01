import { FoodService } from '@/services-server/food-service';
import AddMealForm from '@/components/forms/meal/add-meal-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

const foodsService = new FoodService();

export default async function AddMealPage() {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const response = await foodsService.getAll(user.userId);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  return (
    <main>
      <h1>Add food</h1>

      <AddMealForm foods={response.data} />
    </main>
  );
}
