import Calculator from '@/components/calories/calculator';
import { calculateAge } from '@/helpers/calculate-age';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import CalorieService from '@/services/calories-service';
import type { NutritionGoal } from '@/types/calorie-types';
import { notFound, redirect } from 'next/navigation';

export default async function CaloriesPage() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const userResponse = await AuthService.getCurrentUser(userToken);

  if (!userResponse?.success) {
    notFound();
  }

  const user = userResponse.data;

  const age = calculateAge(user.birthDate);

  const data = {
    weight: Number(user.bodyWeight),
    height: Number(user.height),
    age,
    gender: user.gender,
    activityLevel: 'LIGHT' as const,
  };

  const [calorieResponse, goalResponse] = await Promise.all([CalorieService.getCalorieStats(data, userToken), CalorieService.getCalorieGoal(userToken)]);

  if (!calorieResponse.success) {
    notFound();
  }

  const calorieStats = calorieResponse.data;

  const initialNutritionGoal: NutritionGoal = goalResponse.success
    ? goalResponse.data
    : {
        calorieGoal: 'MAINTENANCE',
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
      };

  return <Calculator user={user} calorieStats={calorieStats} userToken={userToken} initialNutritionGoal={initialNutritionGoal} />;
}
