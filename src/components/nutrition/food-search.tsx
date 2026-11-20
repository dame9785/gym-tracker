'use client';

import { useEffect, useState } from 'react';

import { getProductsAction } from '@/actions/product-actions';
import { getCustomFoodsAction } from '@/actions/custom-food-actions';

import { addProductToMealAction, addCustomFoodToMealAction } from '@/actions/meal-actions';

import ProductImage from '@/components/nutrition/product-image';
import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

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
      <div className="border-border flex shrink-0 items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-text text-lg font-semibold">Add food</h2>
          <p className="text-text-muted mt-1 text-sm">Add food to {mealTitle[mealType]}</p>
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving} ariaLabel="Close" className="!text-text-muted hover:!bg-surface-hover hover:!text-text rounded-lg p-2">
          <span className="text-lg">✕</span>
        </Button>
      </div>

      {/* Search */}
      <div className="border-border shrink-0 border-b py-4">
        <FormInput
          id="food-search"
          name="search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedFood(null);
          }}
          placeholder="Search foods..."
          autoFocus
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-text-muted text-xs font-medium">Product catalog & My foods</p>

          <p className="text-text-muted text-xs">{products.length + customFoods.length} foods</p>
        </div>
      </div>

      {/* Food list */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto py-4 pr-1">
        {isLoading ? (
          <p className="text-text-secondary py-8 text-center text-sm">Searching foods...</p>
        ) : (
          <>
            {/* Products */}
            {products.map((food) => {
              const isSelected = selectedFood?.source === 'PRODUCT' && selectedFood.food.id === food.id;

              return (
                <Button
                  key={`product-${food.id}`}
                  type="button"
                  variant="secondary"
                  size="md"
                  ariaPressed={isSelected}
                  onClick={() => setSelectedFood({ source: 'PRODUCT', food })}
                  className={`!h-auto !w-full !justify-start !rounded-xl !border !p-3 !text-left !transition ${isSelected ? '!border-primary !bg-primary/10' : '!border-border !bg-surface hover:!border-border-hover hover:!bg-surface-hover'}`}
                >
                  <div className="flex w-full items-center gap-3">
                    <ProductImage imageUrl={food.imageUrl} name={food.name} />

                    <div className="min-w-0 flex-1">
                      <p className="text-text truncate text-sm font-medium">{food.name}</p>

                      {food.brand && <p className="text-text-secondary mt-0.5 truncate text-xs">{food.brand}</p>}

                      <p className="text-text-muted mt-1 text-xs">Product catalog</p>
                    </div>

                    <p className="text-text-secondary shrink-0 text-right text-sm font-medium">
                      {Math.round(food.calories)} kcal
                      <span className="text-text-muted block text-xs font-normal">/ 100 g</span>
                    </p>
                  </div>
                </Button>
              );
            })}

            {/* Custom foods */}
            {customFoods.map((food) => {
              const isSelected = selectedFood?.source === 'CUSTOM' && selectedFood.food.id === food.id;

              return (
                <Button
                  key={`custom-${food.id}`}
                  type="button"
                  variant="secondary"
                  size="md"
                  ariaPressed={isSelected}
                  onClick={() => setSelectedFood({ source: 'CUSTOM', food })}
                  className={`!h-auto !w-full !justify-start !rounded-xl !border !p-3 !text-left !transition ${isSelected ? '!border-primary !bg-primary/10' : '!border-border !bg-surface hover:!border-border-hover hover:!bg-surface-hover'}`}
                >
                  <div className="flex w-full items-center gap-3">
                    <ProductImage imageUrl={null} name={food.name} />

                    <div className="min-w-0 flex-1">
                      <p className="text-text truncate text-sm font-medium">{food.name}</p>

                      <p className="text-text-muted mt-1 text-xs">My foods</p>
                    </div>

                    <p className="text-text-secondary shrink-0 text-right text-sm font-medium">
                      {Math.round(food.calories)} kcal
                      <span className="text-text-muted block text-xs font-normal">/ 100 g</span>
                    </p>
                  </div>
                </Button>
              );
            })}

            {!error && products.length === 0 && customFoods.length === 0 && <p className="text-text-muted py-10 text-center text-sm">No foods found.</p>}
          </>
        )}
      </div>

      {/* Selected food */}
      {selectedFood && (
        <div className="border-border bg-background shrink-0 space-y-4 border-t pt-4">
          <div className="flex items-center gap-3">
            {selectedFood.source === 'PRODUCT' && <ProductImage imageUrl={selectedFood.food.imageUrl} name={selectedFood.food.name} size="large" />}

            <div className="min-w-0">
              <p className="text-text truncate font-semibold">{selectedFood.food.name}</p>

              <p className="text-text-muted mt-1 text-xs">Nutrition per 100 g</p>
            </div>
          </div>

          {/* Nutrition */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              {
                label: 'Calories',
                value: selectedFood.food.calories,
                unit: 'kcal',
              },
              {
                label: 'Protein',
                value: selectedFood.food.protein,
                unit: 'g',
              },
              {
                label: 'Carbs',
                value: selectedFood.food.carbs,
                unit: 'g',
              },
              {
                label: 'Fat',
                value: selectedFood.food.fat,
                unit: 'g',
              },
            ].map((item) => (
              <div key={item.label} className="bg-surface rounded-lg p-3">
                <p className="text-text-muted text-xs">{item.label}</p>

                <p className="text-text mt-1 font-semibold">
                  {Math.round(item.value * 10) / 10}
                  <span className="text-text-muted ml-1 text-xs font-normal">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <FormField htmlFor="food-quantity" label="Quantity (grams)">
            <FormInput id="food-quantity" name="quantity" type="number" min="0.1" max="10000" step="0.1" value={quantity} disabled={isSaving} onChange={(event) => setQuantity(event.target.value)} />
          </FormField>

          {/* Add button */}
          <div className="flex justify-end">
            <Button type="button" variant="primary" size="md" onClick={() => void handleAddFood()} disabled={isSaving} loading={isSaving} className="px-5 py-2.5">
              {isSaving ? 'Adding...' : 'Add to meal'}
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="border-danger/30 bg-danger/10 text-danger mt-3 shrink-0 rounded-lg border p-3 text-sm">{error}</p>}
    </div>
  );
}
