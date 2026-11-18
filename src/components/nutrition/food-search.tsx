'use client';

import { useEffect, useState } from 'react';

import { getProductsAction } from '@/actions/product-actions';
import { getCustomFoodsAction } from '@/actions/custom-food-actions';

import { addProductToMealAction, addCustomFoodToMealAction } from '@/actions/meal-actions';

import type { ProductViewModel, CustomFoodViewModel, SelectedFood } from '@/types/foods-type';

import type { MealViewModel } from '@/mapping/meal-mapping';

type Props = {
  date: string;
  mealType: MealViewModel['type'];
  onClose: () => void;
  onAdded: () => Promise<void>;
};

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
  // Meal title
  // --------------------------------------------------

  const mealTitle: Record<MealViewModel['type'], string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    SNACK: 'Snacks',
    OTHER: 'Other',
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="flex max-h-[85vh] min-h-0 flex-col overflow-hidden">
      {/* Header */}

      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Add food</h2>
          <p className="mt-1 text-sm text-zinc-500">Add food to {mealTitle[mealType]}</p>
        </div>

        <button type="button" onClick={onClose} disabled={isSaving} aria-label="Close" className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50">
          <span className="text-lg">✕</span>
        </button>
      </div>

      {/* Search */}

      <div className="shrink-0 border-b border-zinc-800 py-4">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedFood(null);
          }}
          placeholder="Search foods..."
          autoFocus
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Product catalog & My foods</p>

          <p className="text-xs text-zinc-500">{products.length + customFoods.length} foods</p>
        </div>
      </div>

      {/* Food list */}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto py-4 pr-1">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Searching foods...</p>
        ) : (
          <>
            {products.map((food) => (
              <button
                key={`product-${food.id}`}
                type="button"
                onClick={() => setSelectedFood({ source: 'PRODUCT', food })}
                className={`w-full rounded-xl border p-4 text-left transition ${selectedFood?.source === 'PRODUCT' && selectedFood.food.id === food.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{food.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">Product catalog</p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-zinc-300">{Math.round(food.calories)} kcal / 100 g</p>
                </div>
              </button>
            ))}

            {customFoods.map((food) => (
              <button
                key={`custom-${food.id}`}
                type="button"
                onClick={() => setSelectedFood({ source: 'CUSTOM', food })}
                className={`w-full rounded-xl border p-4 text-left transition ${selectedFood?.source === 'CUSTOM' && selectedFood.food.id === food.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{food.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">My foods</p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-zinc-300">{Math.round(food.calories)} kcal / 100 g</p>
                </div>
              </button>
            ))}

            {!error && products.length === 0 && customFoods.length === 0 && <p className="py-10 text-center text-sm text-zinc-500">No foods found.</p>}
          </>
        )}
      </div>

      {/* Selected food */}

      {selectedFood && (
        <div className="shrink-0 space-y-4 border-t border-zinc-800 bg-zinc-950 pt-4">
          <div>
            <p className="font-semibold text-white">{selectedFood.food.name}</p>

            <p className="mt-1 text-xs text-zinc-500">Nutrition per 100 g</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'Calories', value: selectedFood.food.calories, unit: 'kcal' },
              { label: 'Protein', value: selectedFood.food.protein, unit: 'g' },
              { label: 'Carbs', value: selectedFood.food.carbs, unit: 'g' },
              { label: 'Fat', value: selectedFood.food.fat, unit: 'g' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-zinc-900 p-3">
                <p className="text-xs text-zinc-500">{item.label}</p>

                <p className="mt-1 font-semibold text-white">
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

            <input
              id="food-quantity"
              type="number"
              min="0.1"
              max="10000"
              step="0.1"
              value={quantity}
              disabled={isSaving}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => void handleAddFood()} disabled={isSaving} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? 'Adding...' : 'Add to meal'}
            </button>
          </div>
        </div>
      )}

      {/* Error */}

      {error && <p className="mt-3 shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
