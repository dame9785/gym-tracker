'use client';

import { useEffect, useState } from 'react';

import { getProductsAction } from '@/actions/product-actions';
import { getCustomFoodsAction } from '@/actions/custom-food-actions';
import { addProductToMealAction, addCustomFoodToMealAction } from '@/actions/meal-actions';

import type { MealViewModel } from '@/mapping/meal-mapping';

// --------------------------------------------------
// Types
// --------------------------------------------------

type ProductViewModel = Extract<Awaited<ReturnType<typeof getProductsAction>>, { success: true }>['data'][number];

type CustomFoodViewModel = Extract<Awaited<ReturnType<typeof getCustomFoodsAction>>, { success: true }>['data'][number];

type SelectedFood = { source: 'PRODUCT'; food: ProductViewModel } | { source: 'CUSTOM'; food: CustomFoodViewModel };

type Props = {
  date: string;
  mealType: MealViewModel['type'];
  onClose: () => void;
  onAdded: () => Promise<void>;
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function FoodSearch({ date, mealType, onClose, onAdded }: Props) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [customFoods, setCustomFoods] = useState<CustomFoodViewModel[]>([]);
  const [selectedFood, setSelectedFood] = useState<SelectedFood | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // Search foods
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productResult, customFoodResult] = await Promise.all([getProductsAction(search.trim() || undefined), getCustomFoodsAction(search.trim() || undefined)]);

        if (cancelled) return;

        setProducts(productResult.success ? productResult.data : []);
        setCustomFoods(customFoodResult.success ? customFoodResult.data : []);

        if (!productResult.success || !customFoodResult.success) {
          setError(!productResult.success ? productResult.message : !customFoodResult.success ? customFoodResult.message : 'Could not load foods.');
        }
      } catch {
        if (!cancelled) {
          setError('Could not load foods.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search]);

  // --------------------------------------------------
  // Add food
  // --------------------------------------------------

  async function handleAddFood() {
    if (!selectedFood) return;

    const amount = Number(quantity);

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      setError('Enter a valid quantity between 0 and 10000 grams.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result =
        selectedFood.source === 'PRODUCT'
          ? await addProductToMealAction({
              productId: selectedFood.food.id,
              date,
              type: mealType,
              quantity: amount,
            })
          : await addCustomFoodToMealAction({
              customFoodId: selectedFood.food.id,
              date,
              type: mealType,
              quantity: amount,
            });

      if (!result.success) {
        setError(result.message);
        return;
      }

      await onAdded();
      onClose();
    } catch {
      setError('Could not add food.');
    } finally {
      setIsSaving(false);
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-5 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white">Add food</h4>

        <button type="button" onClick={onClose} className="text-sm text-zinc-400 transition hover:text-white">
          Close
        </button>
      </div>

      {/* Search */}

      <input
        type="search"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setSelectedFood(null);
        }}
        placeholder="Search foods..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
      />

      {/* Food list */}

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {isLoading ? (
          <p className="py-4 text-center text-sm text-zinc-400">Searching...</p>
        ) : (
          <>
            {products.map((food) => (
              <button
                key={`product-${food.id}`}
                type="button"
                onClick={() => setSelectedFood({ source: 'PRODUCT', food })}
                className={`w-full rounded-lg border p-3 text-left transition ${selectedFood?.source === 'PRODUCT' && selectedFood.food.id === food.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{food.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">Product catalog</p>
                  </div>

                  <p className="text-sm text-zinc-300">{Math.round(food.calories)} kcal / 100 g</p>
                </div>
              </button>
            ))}

            {customFoods.map((food) => (
              <button
                key={`custom-${food.id}`}
                type="button"
                onClick={() => setSelectedFood({ source: 'CUSTOM', food })}
                className={`w-full rounded-lg border p-3 text-left transition ${selectedFood?.source === 'CUSTOM' && selectedFood.food.id === food.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{food.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">My foods</p>
                  </div>

                  <p className="text-sm text-zinc-300">{Math.round(food.calories)} kcal / 100 g</p>
                </div>
              </button>
            ))}

            {products.length === 0 && customFoods.length === 0 && <p className="py-4 text-center text-sm text-zinc-500">No foods found.</p>}
          </>
        )}
      </div>

      {/* Selected food */}

      {selectedFood && (
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <p className="font-medium text-white">{selectedFood.food.name}</p>

            <p className="mt-1 text-xs text-zinc-500">Nutrition per 100 g</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Calories', value: selectedFood.food.calories, unit: 'kcal' },
              { label: 'Protein', value: selectedFood.food.protein, unit: 'g' },
              { label: 'Carbs', value: selectedFood.food.carbs, unit: 'g' },
              { label: 'Fat', value: selectedFood.food.fat, unit: 'g' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-zinc-950 p-2">
                <p className="text-xs text-zinc-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {Math.round(item.value * 10) / 10}
                  <span className="ml-1 text-xs font-normal text-zinc-500">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="food-quantity" className="mb-2 block text-sm text-zinc-400">
              Quantity (grams)
            </label>

            <input id="food-quantity" type="number" min="1" max="10000" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-500" />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => void handleAddFood()} disabled={isSaving} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? 'Adding...' : 'Add to meal'}
            </button>
          </div>
        </div>
      )}

      {/* Error */}

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
