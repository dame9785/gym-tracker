import MealCard from './meal-card';
import { MealViewModel } from '@/types/meal-types';

type Props = {
  meals: MealViewModel[];
};

export default function MealList({ meals }: Props) {
  if (meals.length === 0) {
    return <p className="text-sm text-gray-400">No meals added today.</p>;
  }

  return (
    <div className="space-y-2">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
