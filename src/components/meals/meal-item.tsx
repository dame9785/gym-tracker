import { MealItemViewModel } from '@/types/meal-types';

type MealItemProps = {
  item: MealItemViewModel;
};

export default function MealItem({ item }: MealItemProps) {
  return (
    <article className="flex items-center justify-between border-b border-slate-800 py-2 last:border-b-0">
      {/* Food info */}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-medium text-white">{item.food.name}</h3>

        <span className="text-xs text-slate-400">{item.grams} g</span>
      </div>

      {/* Nutrition */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-400">
          P <strong className="text-slate-200">{item.protein.toFixed(1)}g</strong>
        </span>

        <span className="text-slate-400">
          C <strong className="text-slate-200">{item.carbs.toFixed(1)}g</strong>
        </span>

        <span className="text-slate-400">
          F <strong className="text-slate-200">{item.fat.toFixed(1)}g</strong>
        </span>

        <div className="ml-2 min-w-[55px] text-right">
          <strong className="text-sm text-orange-400">{item.calories.toFixed(0)}</strong>

          <span className="ml-1 text-[10px] text-slate-500">kcal</span>
        </div>
      </div>
    </article>
  );
}
