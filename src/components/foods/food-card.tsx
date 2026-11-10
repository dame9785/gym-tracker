import type { ExternalFood } from '@/lib/food-providers/food-provider';
import Button from '@/components/button/button';

type Props = {
  food: ExternalFood;
  onImport: (food: ExternalFood) => void;
  isImporting: boolean;
};

export default function FoodCard({ food, onImport, isImporting }: Props) {
  const nutrients = [
    {
      label: 'Kalorier',
      value: food.caloriesPer100g,
      unit: 'kcal',
      color: 'text-orange-400',
    },
    {
      label: 'Protein',
      value: food.proteinPer100g,
      unit: 'g',
      color: 'text-blue-400',
    },
    {
      label: 'Kolhydrater',
      value: food.carbsPer100g,
      unit: 'g',
      color: 'text-amber-400',
    },
    {
      label: 'Fett',
      value: food.fatPer100g,
      unit: 'g',
      color: 'text-emerald-400',
    },
  ];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5">
      {/* Product information */}
      <div className="flex items-center gap-4">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 sm:size-28">
          <span className="text-5xl" aria-hidden="true">
            🍽️
          </span>

          {food.imageUrl && (
            <img
              src={food.imageUrl}
              alt={food.name}
              className="absolute inset-0 size-full bg-zinc-950 object-contain p-2"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-orange-400 uppercase">Livsmedelsverket</span>

          <h3 className="mt-2 line-clamp-3 text-base leading-snug font-bold text-white">{food.name}</h3>

          {food.brand && <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{food.brand}</p>}
        </div>
      </div>

      {/* Nutrition values */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {nutrients.map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-1.5 py-3 text-center">
            <p className="text-[10px] text-zinc-500 sm:text-xs">{item.label}</p>

            <p className={`mt-1 text-sm font-bold sm:text-base ${item.color}`}>{Number(item.value.toFixed(1))}</p>

            <p className="mt-0.5 text-[10px] text-zinc-600">{item.unit}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-2 gap-5 pt-5">
        <p className="mb-3 text-[10px] text-zinc-500">Näringsvärde per 100 g</p>
        <Button variant="primary" size="sm" loading={isImporting} disabled={isImporting} onClick={() => onImport(food)}>
          Importera
        </Button>
      </div>
    </article>
  );
}
