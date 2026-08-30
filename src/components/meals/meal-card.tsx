import { MealViewModel } from '@/types/meal-types';
import MealItem from '@/components/meals/meal-item';

type MealCardProps = {
  meal: MealViewModel;
};

export default function MealCard({ meal }: MealCardProps) {
  const totalCalories = meal.items.reduce((total, item) => total + item.calories, 0);

  return (
    <article
      className="group relative overflow-hidden
        rounded-2xl border border-zinc-800
        bg-linear-to-br from-zinc-900 to-zinc-950
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-orange-500/40
        hover:shadow-xl
        hover:shadow-orange-500/5"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="mt-1 block text-lg font-bold text-white">
            {meal.mealType.charAt(0)}
            {meal.mealType.slice(1).toLowerCase()}
          </h2>
          <span className="text-xs text-slate-400">{meal.items.length} foods</span>
        </div>

        <div className="text-right">
          <strong className="mt-1 block text-lg font-bold">{totalCalories.toFixed(0)}</strong>
          <span className=" mt-1 block text-sm font-bold">kcal</span>
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
