'use client';

import { Beef, Check, Droplets, Pencil, PlusCircle, Trash2, Wheat, X } from 'lucide-react';

import type { MealViewModel } from '@/mapping/meal-mapping';

import { calculateMealNutrition } from '@/utils/meal-calculations';

import FoodModal from '@/components/modal/food-modal';

// --------------------------------------------------
// Types
// --------------------------------------------------

type MealSectionConfig = {
  type: MealViewModel['type'];
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

type Props = {
  section: MealSectionConfig;
  meal: MealViewModel | undefined;
  date: string;
  isActive: boolean;
  editingItemId: number | null;
  editingQuantity: string;
  isSavingItem: boolean;
  onAddFood: () => void;
  onCloseFoodSearch: () => void;
  onFoodAdded: () => Promise<void>;
  onStartEditing: (itemId: number, quantity: number) => void;
  onCancelEditing: () => void;
  onQuantityChange: (quantity: string) => void;
  onSaveQuantity: (itemId: number) => void;
  onDeleteFood: (itemId: number) => void;
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function MealSection({ section, meal, date, isActive, editingItemId, editingQuantity, isSavingItem, onAddFood, onCloseFoodSearch, onFoodAdded, onStartEditing, onCancelEditing, onQuantityChange, onSaveQuantity, onDeleteFood }: Props) {
  const MealIcon = section.icon;

  const mealTotals = calculateMealNutrition(meal?.items ?? []);
  const itemCount = meal?.items.length ?? 0;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="border-border bg-surface/60 rounded-xl border p-4">
      {/* Meal header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="bg-surface-secondary/80 rounded-lg p-2">
            <MealIcon size={17} className={section.color} />
          </div>

          <h3 className="text-text font-semibold">{section.label}</h3>

          <span className="bg-surface-secondary text-text-muted rounded-md px-2 py-0.5 text-xs">
            {itemCount} {itemCount === 1 ? 'food' : 'foods'}
          </span>
        </div>

        <button type="button" onClick={onAddFood} className="border-primary/40 text-primary hover:bg-primary/10 flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition">
          <PlusCircle size={15} />
          Add food
        </button>
      </div>

      {/* Food modal */}
      {isActive && <FoodModal mealType={section.type} mealLabel={section.label} date={date} onClose={onCloseFoodSearch} onAdded={onFoodAdded} />}

      {/* Registered foods */}
      {meal?.items.length ? (
        <div className="divide-border mt-3 divide-y">
          {meal.items.map((item) => {
            const foodName = item.product?.name ?? item.customFood?.name ?? item.nameSnapshot;

            const isEditing = editingItemId === item.id;

            return (
              <div key={item.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-text truncate text-sm font-medium">{foodName}</p>

                    {isEditing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="0.1"
                          max="10000"
                          step="0.1"
                          value={editingQuantity}
                          onChange={(event) => onQuantityChange(event.target.value)}
                          disabled={isSavingItem}
                          aria-label="Food quantity in grams"
                          className="border-border-hover bg-background text-text focus:border-primary w-24 rounded-lg border px-2 py-1.5 text-sm outline-none"
                        />

                        <span className="text-text-muted text-xs">g</span>

                        <button type="button" onClick={() => onSaveQuantity(item.id)} disabled={isSavingItem} aria-label="Save quantity" title="Save quantity" className="rounded-lg p-1.5 text-green-400 transition hover:bg-green-500/10 disabled:opacity-50">
                          <Check size={17} />
                        </button>

                        <button type="button" onClick={onCancelEditing} disabled={isSavingItem} aria-label="Cancel editing" title="Cancel editing" className="text-text-muted hover:bg-surface-hover rounded-lg p-1.5 transition disabled:opacity-50">
                          <X size={17} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-text-muted mt-0.5 text-xs">{item.quantity} g</p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <p className="text-text text-sm font-semibold">{Math.round(item.caloriesSnapshot)} kcal</p>

                    {!isEditing && (
                      <>
                        <button type="button" onClick={() => onStartEditing(item.id, item.quantity)} disabled={isSavingItem} aria-label={`Edit ${foodName}`} title="Edit quantity" className="text-text-muted hover:bg-surface-hover hover:text-primary rounded-lg p-1.5 transition disabled:opacity-50">
                          <Pencil size={15} />
                        </button>

                        <button type="button" onClick={() => onDeleteFood(item.id)} disabled={isSavingItem} aria-label={`Remove ${foodName}`} title="Remove food" className="text-text-muted rounded-lg p-1.5 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Macronutrients */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Beef size={13} className="text-blue-400" />
                    Protein:
                    <span className="text-text-secondary font-medium">{item.proteinSnapshot.toFixed(1)} g</span>
                  </span>

                  <span className="text-text-muted flex items-center gap-1.5">
                    <Wheat size={13} className="text-green-400" />
                    Carbs:
                    <span className="text-text-secondary font-medium">{item.carbsSnapshot.toFixed(1)} g</span>
                  </span>

                  <span className="text-text-muted flex items-center gap-1.5">
                    <Droplets size={13} className="text-purple-400" />
                    Fat:
                    <span className="text-text-secondary font-medium">{item.fatSnapshot.toFixed(1)} g</span>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Meal total */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
            <span className="text-text-secondary text-xs font-semibold">Meal total</span>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-text font-semibold">{Math.round(mealTotals.calories)} kcal</span>

              <span className="text-text-muted">P: {mealTotals.protein.toFixed(1)} g</span>

              <span className="text-text-muted">C: {mealTotals.carbs.toFixed(1)} g</span>

              <span className="text-text-muted">F: {mealTotals.fat.toFixed(1)} g</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-text-muted mt-3 text-sm">No food registered yet.</p>
      )}
    </div>
  );
}
