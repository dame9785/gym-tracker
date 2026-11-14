import { requireAuth } from '@/lib/auth';

import { MealService } from '@/services/meal-service';
import { MealMapping } from '@/mapping/meal-mapping';

import Header from '@/components/ui/header';
import NutritionClient from '@/components/nutrition/nutrition-client';

const mealService = new MealService();

export default async function NutritionPage() {
  const user = await requireAuth();

  const today = new Date();
  const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  const meals = await mealService.getMealsByDate(user.userId, date);
  const mappedMeals = meals.map(MealMapping.mapMeal);

  return (
    <div className="w-full">
      <Header title="Nutrition" subTitle="Daily nutrition" description="Track your daily food intake and keep an eye on your calories and macros." />

      <NutritionClient initialMeals={mappedMeals} initialDate={date.toISOString().slice(0, 10)} />
    </div>
  );
}
