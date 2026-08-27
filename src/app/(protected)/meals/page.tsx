import { getTokenFromCookieStore } from '@/lib/auth';
import MealService from '@/services/meal-service';
import { redirect } from 'next/navigation';

export default async function MealPage() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const response = await MealService.getMeals(userToken);
  if (!response.success) {
    return <h1>Error</h1>;
  }
  const meals = response.data.meals;
  console.log(response);

  return <h1>Hej</h1>;
}
