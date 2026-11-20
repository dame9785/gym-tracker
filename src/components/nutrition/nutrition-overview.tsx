import { Beef, Droplets, Flame, Wheat } from 'lucide-react';

import NutritionStatCard from './nutrition-stat-card';

type NutritionGoals = {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
} | null;

type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Props = {
  totals: NutritionTotals;
  goals: NutritionGoals;
  isLoading: boolean;
};

export default function NutritionOverview({ totals, goals, isLoading }: Props) {
  const nutritionItems = [
    {
      label: 'Calories',
      value: totals.calories,
      target: goals?.calories ?? null,
      unit: 'kcal',
      icon: Flame,
      color: 'text-primary',
      progressColor: 'bg-primary',
      background: 'bg-primary/10',
    },
    {
      label: 'Protein',
      value: totals.protein,
      target: goals?.protein ?? null,
      unit: 'g',
      icon: Beef,
      color: 'text-danger',
      progressColor: 'bg-danger',
      background: 'bg-danger/10',
    },
    {
      label: 'Carbs',
      value: totals.carbs,
      target: goals?.carbs ?? null,
      unit: 'g',
      icon: Wheat,
      color: 'text-warning',
      progressColor: 'bg-warning',
      background: 'bg-warning/10',
    },
    {
      label: 'Fat',
      value: totals.fat,
      target: goals?.fat ?? null,
      unit: 'g',
      icon: Droplets,
      color: 'text-info',
      progressColor: 'bg-info',
      background: 'bg-info/10',
    },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-text text-sm font-semibold">Daily overview</h2>

        {isLoading && <span className="text-text-muted text-xs">Updating...</span>}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {nutritionItems.map((item) => (
          <NutritionStatCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
