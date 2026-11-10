import type { ExternalFood } from '@/lib/food-providers/food-provider';

type Props = {
  food: ExternalFood;
  onImport: (food: ExternalFood) => void;
  isImporting: boolean;
};

export default function FoodCard({ food, onImport, isImporting }: Props) {
  const nutrients = [
    { label: 'Kalorier', value: food.caloriesPer100g, unit: 'kcal' },
    { label: 'Protein', value: food.proteinPer100g, unit: 'g' },
    { label: 'Kolhydrater', value: food.carbsPer100g, unit: 'g' },
    { label: 'Fett', value: food.fatPer100g, unit: 'g' },
  ];

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-white">{food.name}</h3>

          {food.brand && <p className="mt-1 text-sm text-zinc-400">{food.brand}</p>}

          <p className="mt-1 text-xs text-zinc-500">{food.source === 'OPEN_FOOD_FACTS' ? 'Open Food Facts' : 'Livsmedelsverket'}</p>
        </div>

        <button type="button" onClick={() => onImport(food)} disabled={isImporting} className="shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
          {isImporting ? 'Importerar...' : 'Importera'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-zinc-800 pt-4 sm:grid-cols-4">
        {nutrients.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-zinc-500">{item.label}</p>

            <p className="mt-1 font-semibold text-white">
              {Number(item.value.toFixed(1))}
              <span className="ml-1 text-xs font-normal text-zinc-500">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-right text-[11px] text-zinc-500">Näringsvärde per 100 g</p>
    </article>
  );
}
