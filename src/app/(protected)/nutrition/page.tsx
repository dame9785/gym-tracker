import { requireAuth } from '@/lib/auth';

import { MealService } from '@/services/meal-service';
import { GoalService } from '@/services/goal-service';

import { MealMapping } from '@/mapping/meal-mapping';

import Header from '@/components/ui/header';
import NutritionClient from '@/components/nutrition/nutrition-client';

const mealService = new MealService();
const goalService = new GoalService();

export default async function NutritionPage() {
  const user = await requireAuth();

  const today = new Date();
  const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // --------------------------------------------------
  // Fetch meals
  // --------------------------------------------------

  const meals = await mealService.getMealsByDate(user.userId, date);
  const mappedMeals = meals.map(MealMapping.mapMeal);

  // --------------------------------------------------
  // Fetch nutrition goals
  // --------------------------------------------------

  const nutritionGoals = await goalService.getByUserId(user.userId);

  return (
    <div className="w-full">
      <Header title="Nutrition" subTitle="Daily nutrition" description="Track your daily food intake and keep an eye on your calories and macros." />

      <NutritionClient initialMeals={mappedMeals} initialDate={date.toISOString().slice(0, 10)} initialGoals={nutritionGoals} />
    </div>
  );
}
