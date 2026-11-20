import { requireAuth } from '@/lib/auth';

import { MealService } from '@/services/meal-service';
import { GoalService } from '@/services/goal-service';

import { MealMapping } from '@/mapping/meal-mapping';

import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';
import NutritionClient from '@/components/nutrition/nutrition-client';

import { getTodayDate } from '@/utils/date-utils';

const mealService = new MealService();
const goalService = new GoalService();

export default async function NutritionPage() {
  const user = await requireAuth();

  const initialDate = getTodayDate();
  const date = new Date(`${initialDate}T00:00:00.000Z`);

  // Fetch meals
  const meals = await mealService.getMealsByDate(user.userId, date);
  const mappedMeals = meals.map(MealMapping.mapMeal);

  // Fetch nutrition goals
  const nutritionGoals = await goalService.getByUserId(user.userId);

  return (
    <PageContainer>
      <Header title="Nutrition" subTitle="Daily nutrition" description="Track your daily food intake and keep an eye on your calories and macros." />

      <NutritionClient initialMeals={mappedMeals} initialDate={initialDate} initialGoals={nutritionGoals} />
    </PageContainer>
  );
}
