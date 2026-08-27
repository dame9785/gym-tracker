import { Activity, Dumbbell, TrendingDown } from 'lucide-react';
import type { CalorieCalculatorResult } from '@/types/calorie-types';
import type { CalorieGoal } from '@/types/calorie-types';

export function getCalorieGoalStats(calorieStats: CalorieCalculatorResult) {
  return [
    {
      title: 'Viktnedgång',
      calories: calorieStats.weightLossCalories,
      description: 'Cirka 500 kcal underskott',
      icon: TrendingDown,
      goal: 'WEIGHT_LOSS' as CalorieGoal,
      iconClass: 'bg-red-500/10 text-red-400',
      borderClass: 'border-red-500/20 hover:border-red-500/40',
      activeClass: 'border-red-500 bg-red-500/10 ring-1 ring-red-500/30',
    },
    {
      title: 'Underhåll',
      calories: calorieStats.maintenanceCalories,
      description: 'Behåll din nuvarande vikt',
      icon: Activity,
      goal: 'MAINTENANCE' as CalorieGoal,
      iconClass: 'bg-blue-500/10 text-blue-400',
      borderClass: 'border-blue-500/20 hover:border-blue-500/40',
      activeClass: 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30',
    },
    {
      title: 'Muskeluppgång',
      calories: calorieStats.muscleGainCalories,
      description: 'Cirka 300 kcal överskott',
      icon: Dumbbell,
      goal: 'MUSCLE_GAIN' as CalorieGoal,
      iconClass: 'bg-green-500/10 text-green-400',
      borderClass: 'border-green-500/20 hover:border-green-500/40',
      activeClass: 'border-green-500 bg-green-500/10 ring-1 ring-green-500/30',
    },
  ];
}
