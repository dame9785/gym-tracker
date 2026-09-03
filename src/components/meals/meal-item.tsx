import { MealItemViewModel } from '@/types/meal-types';
import DeleteMealItemButton from '@/components/meals/delete-meal-item-button';

type MealItemProps = {
  item: MealItemViewModel;
};

export default function MealItem({ item }: MealItemProps) {
  return (
    <article className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-slate-800 py-2 last:border-b-0">
      {/* Food info */}
      <div className="min-w-0">
        <h3 className="truncate text-l font-bold text-white">{item.food.name}</h3>

        <span className="text-l">{item.grams} g</span>
      </div>

      {/* Nutrition */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-sm  font-bold">
          P <strong>{item.protein.toFixed(1)}g</strong>
        </span>

        <span className="text-sm  font-bold">
          C <strong>{item.calories.toFixed(1)}g</strong>
        </span>

        <span className="text-sm  font-bold">
          F <strong>{item.fat.toFixed(1)}g</strong>
        </span>
        <span className="text-sm  font-bold">
          C <strong>{item.carbs.toFixed(1)}g</strong>
        </span>
      </div>

      {/* Calories + Delete */}
      <div className="flex items-center gap-4">
        <DeleteMealItemButton mealItemId={item.id} />
      </div>
    </article>
  );
}
