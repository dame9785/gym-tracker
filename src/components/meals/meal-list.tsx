import MealCard from './meal-card';
import { MealViewModel } from '@/types/meal-types';

type Props = {
  meals: MealViewModel[];
};

const mealTypes = [
  {
    key: 'BREAKFAST',
    title: 'Breakfast',
  },
  {
    key: 'LUNCH',
    title: 'Lunch',
  },
  {
    key: 'DINNER',
    title: 'Dinner',
  },
  {
    key: 'SNACK',
    title: 'Snacks',
  },
];

export default function MealList({ meals }: Props) {
  if (meals.length === 0) {
    return <p className="text-sm text-gray-400">No meals added today.</p>;
  }

  return (
    <div className="space-y-6">
      {mealTypes.map((mealType) => {
        // Hämta alla meals av denna typ
        const mealsForType = meals.filter((meal) => meal.mealType === mealType.key);

        if (mealsForType.length === 0) {
          return null;
        }

        // Slå ihop alla foods från meals med samma typ
        const combinedItems = mealsForType.flatMap((meal) => meal.items);

        // Skapa ett sammanslaget meal
        const combinedMeal: MealViewModel = {
          ...mealsForType[0],
          id: mealsForType[0].id,

          items: combinedItems,
        };

        return (
          <section key={mealType.key}>
            {/* Meal type */}
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{mealType.title}</h2>
              <span className="text-xs text-slate-500">{combinedItems.length} foods</span>
            </div>

            {/* Ett kort med alla foods */}
            <MealCard meal={combinedMeal} />
          </section>
        );
      })}
    </div>
  );
}
