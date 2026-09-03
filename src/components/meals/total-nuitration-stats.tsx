import { NutritionGoals } from '@/types/calorie-types';
import { NutritionGoalViewModel, NutritionTotals } from '@/types/meal-types';

type Props = {
  totalNuitrationsStats: NutritionTotals;
  recomendedIntakeStats: NutritionGoals;
};

export default function TotalNuitrationStats({ totalNuitrationsStats, recomendedIntakeStats }: Props) {
  console.log('Daily Intake goals');
  return (
    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Calories */}
      <div
        className="
            group relative overflow-hidden
            rounded-2xl border border-zinc-800
            bg-linear-to-br from-zinc-900 to-zinc-950
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-orange-500/40
            hover:shadow-xl
            hover:shadow-orange-500/5
          "
      >
        <span className="text-xs text-slate-400">Calories</span>

        <strong className="mt-1 block text-lg font-bold text-white">
          {totalNuitrationsStats.calories.toFixed(0)}
          <span className="mx-1 text-sm text-slate-500">/</span>
          {recomendedIntakeStats.recomendedCaloriesIntake}g
        </strong>

        <span className="text-[11px] text-slate-500">kcal</span>
      </div>

      {/* Protein */}
      <div
        className="
            group relative overflow-hidden
            rounded-2xl border border-zinc-800
            bg-linear-to-br from-zinc-900 to-zinc-950
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-orange-500/40
            hover:shadow-xl
            hover:shadow-orange-500/5
          "
      >
        <span className="text-xs text-slate-400">Protein</span>

        <strong className="mt-1 block text-lg font-bold text-white">
          {totalNuitrationsStats.protein.toFixed(1)}
          <span className="mx-1 text-sm text-slate-500">/</span>
          {recomendedIntakeStats.recomendedProteinIntake}g
        </strong>

        <span className="text-[11px] text-slate-500">grams</span>
      </div>

      {/* Carbs */}
      <div
        className="
            group relative overflow-hidden
            rounded-2xl border border-zinc-800
            bg-linear-to-br from-zinc-900 to-zinc-950
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-orange-500/40
            hover:shadow-xl
            hover:shadow-orange-500/5
          "
      >
        <span className="text-xs text-slate-400">Carbs</span>

        <strong className="mt-1 block text-lg font-bold text-white">
          {totalNuitrationsStats.carbs.toFixed(1)}
          <span className="mx-1 text-sm text-slate-500">/</span>
          {recomendedIntakeStats.recomendedCarbsIntake}g
        </strong>

        <span className="text-[11px] text-slate-500">grams</span>
      </div>

      {/* Fat */}
      <div
        className="
            group relative overflow-hidden
            rounded-2xl border border-zinc-800
            bg-linear-to-br from-zinc-900 to-zinc-950
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-orange-500/40
            hover:shadow-xl
            hover:shadow-orange-500/5
          "
      >
        <span className="text-xs text-slate-400">Fat</span>

        <strong className="mt-1 block text-lg font-bold text-white">
          {totalNuitrationsStats.fat.toFixed(1)}
          <span className="mx-1 text-sm text-slate-500">/</span>
          {recomendedIntakeStats.recomendedFatIntake}g
        </strong>

        <span className="text-[11px] text-slate-500">grams</span>
      </div>
    </section>
  );
}
