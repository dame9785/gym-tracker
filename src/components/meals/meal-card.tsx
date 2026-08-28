import { MealViewModel } from '@/types/meal-types';
import MealItem from '@/components/meals/meal-item';

type MealCardProps = {
  meal: MealViewModel;
};

export default function MealCard({ meal }: MealCardProps) {
  const totalCalories = meal.items.reduce((total, item) => total + item.calories, 0);

  return (
    <article className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">
            {meal.mealType.charAt(0)}
            {meal.mealType.slice(1).toLowerCase()}
          </h2>

          <span className="text-xs text-slate-400">{meal.items.length} foods</span>
        </div>

        <div className="text-right">
          <strong className="text-sm font-bold text-orange-400">{totalCalories.toFixed(0)}</strong>

          <span className="ml-1 text-[10px] text-slate-400">kcal</span>
        </div>
      </header>

      {/* Foods */}
      <div className="divide-y divide-slate-800">
        {meal.items.length === 0 ? (
          <p className="py-3 text-sm text-slate-400">No food added.</p>
        ) : (
          meal.items.map((item) => <MealItem key={item.id} item={item} />)
        )}
      </div>
    </article>
  );
}
