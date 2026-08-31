import FoodsService from '@/services/food-service';
import AddMealForm from '@/components/forms/meal/add-meal-form';
import ErrorMessage from '@/components/ui/error-message';
import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';

const foodsService = new FoodsService();

export default async function AddMealPage() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const response = await foodsService.getAllFoods();

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

      <AddMealForm userToken={userToken} foods={response.data.foods} />
    </main>
  );
}
