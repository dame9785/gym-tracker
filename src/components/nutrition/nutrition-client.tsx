'use client';

import { useState } from 'react';

import { Beef, CalendarDays, Check, ChevronLeft, ChevronRight, Cookie, Droplets, Flame, Pencil, PlusCircle, Sun, Sunrise, Sunset, Trash2, Utensils, Wheat, X } from 'lucide-react';

import { getMealsByDateAction, updateMealItemQuantityAction, removeMealItemAction } from '@/actions/meal-actions';

import type { MealViewModel } from '@/mapping/meal-mapping';

import FoodSearch from '@/components/nutrition/food-search';

// --------------------------------------------------
// Types
// --------------------------------------------------

type Props = {
  initialMeals: MealViewModel[];
  initialDate: string;
};

// --------------------------------------------------
// Constants
// --------------------------------------------------

const mealSections = [
  { type: 'BREAKFAST', label: 'Breakfast', icon: Sunrise, color: 'text-orange-400' },
  { type: 'LUNCH', label: 'Lunch', icon: Sun, color: 'text-yellow-400' },
  { type: 'DINNER', label: 'Dinner', icon: Sunset, color: 'text-purple-400' },
  { type: 'SNACK', label: 'Snacks', icon: Cookie, color: 'text-amber-400' },
  { type: 'OTHER', label: 'Other', icon: Utensils, color: 'text-zinc-400' },
] as const;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTodayDate(): string {
  return formatDateInput(new Date());
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function NutritionClient({ initialMeals, initialDate }: Props) {
  const [meals, setMeals] = useState(initialMeals);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMealType, setActiveMealType] = useState<MealViewModel['type'] | null>(null);

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [isSavingItem, setIsSavingItem] = useState(false);

  const today = getTodayDate();

  // --------------------------------------------------
  // Calculate daily nutrition
  // --------------------------------------------------

  const totals = meals.reduce(
    (total, meal) => {
      meal.items.forEach((item) => {
        total.calories += item.caloriesSnapshot;
        total.protein += item.proteinSnapshot;
        total.carbs += item.carbsSnapshot;
        total.fat += item.fatSnapshot;
      });

      return total;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );

  // --------------------------------------------------
  // Load meals by date
  // --------------------------------------------------

  async function loadMeals(date: string) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMealsByDateAction(date);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMeals(result.data);
      setSelectedDate(date);
    } catch {
      setError('Could not load meals.');
    } finally {
      setIsLoading(false);
    }
  }

  // --------------------------------------------------
  // Edit meal item quantity
  // --------------------------------------------------

  function startEditing(itemId: number, quantity: number) {
    setEditingItemId(itemId);
    setEditingQuantity(String(quantity));
    setError(null);
  }

  function cancelEditing() {
    setEditingItemId(null);
    setEditingQuantity('');
  }

  async function saveQuantity(itemId: number) {
    const quantity = Number(editingQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000) {
      setError('Enter a valid quantity between 0 and 10000 grams.');
      return;
    }

    setIsSavingItem(true);
    setError(null);

    try {
      const result = await updateMealItemQuantityAction({
        mealItemId: itemId,
        quantity,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMeals((currentMeals) => currentMeals.map((meal) => (meal.id === result.data.id ? result.data : meal)));

      cancelEditing();
    } catch {
      setError('Could not update food quantity.');
    } finally {
      setIsSavingItem(false);
    }
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async function deleteFood(itemId: number) {
    const confirmed = window.confirm('Are you sure you want to remove this food?');

    if (!confirmed) {
      return;
    }

    setIsSavingItem(true);
    setError(null);

    try {
      const result = await removeMealItemAction(itemId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMeals((currentMeals) => currentMeals.map((meal) => (meal.id === result.data.id ? result.data : meal)));

      if (editingItemId === itemId) {
        cancelEditing();
      }
    } catch {
      setError('Could not remove food.');
    } finally {
      setIsSavingItem(false);
    }
  }

  // --------------------------------------------------
  // Change date
  // --------------------------------------------------

  function changeDate(days: number) {
    const date = new Date(`${selectedDate}T12:00:00`);

    date.setDate(date.getDate() + days);

    const nextDate = formatDateInput(date);

    if (nextDate > today) {
      return;
    }

    setActiveMealType(null);
    cancelEditing();
    void loadMeals(nextDate);
  }

  // --------------------------------------------------
  // Format selected date
  // --------------------------------------------------

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${selectedDate}T12:00:00`));

  // --------------------------------------------------
  // Nutrition overview items
  // --------------------------------------------------

  const nutritionItems = [
    {
      label: 'Calories',
      value: totals.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-400',
      background: 'bg-orange-500/10',
    },
    {
      label: 'Protein',
      value: totals.protein,
      unit: 'g',
      icon: Beef,
      color: 'text-blue-400',
      background: 'bg-blue-500/10',
    },
    {
      label: 'Carbs',
      value: totals.carbs,
      unit: 'g',
      icon: Wheat,
      color: 'text-green-400',
      background: 'bg-green-500/10',
    },
    {
      label: 'Fat',
      value: totals.fat,
      unit: 'g',
      icon: Droplets,
      color: 'text-purple-400',
      background: 'bg-purple-500/10',
    },
  ];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Date navigation */}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <CalendarDays size={15} />
            Selected day
          </div>

          <h2 className="mt-1 text-xl font-semibold text-white">{formattedDate}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => changeDate(-1)} disabled={isLoading || isSavingItem} aria-label="Previous day" className="rounded-lg border border-zinc-700 p-2.5 text-zinc-300 transition hover:border-orange-500 hover:text-orange-400 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>

          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(event) => {
              if (event.target.value) {
                setActiveMealType(null);
                cancelEditing();
                void loadMeals(event.target.value);
              }
            }}
            disabled={isLoading || isSavingItem}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
          />

          <button type="button" onClick={() => changeDate(1)} disabled={isLoading || isSavingItem || selectedDate >= today} aria-label="Next day" className="rounded-lg border border-zinc-700 p-2.5 text-zinc-300 transition hover:border-orange-500 hover:text-orange-400 disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Error message */}

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {/* Daily nutrition overview */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <Utensils size={17} className="text-orange-400" />
            Daily overview
          </h2>

          {isLoading && <span className="text-xs text-zinc-400">Loading...</span>}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {nutritionItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className={`rounded-md p-1.5 ${item.background}`}>
                    <Icon size={16} className={item.color} />
                  </div>

                  <p className="text-xs text-zinc-400">{item.label}</p>
                </div>

                <p className="mt-2 text-xl font-bold text-white">
                  {Math.round(item.value)}

                  <span className="ml-1 text-xs font-normal text-zinc-500">{item.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meal sections */}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Meals</h2>

          <p className="mt-1 text-sm text-zinc-400">Your registered food throughout the day.</p>
        </div>

        {mealSections.map((section) => {
          const meal = meals.find((item) => item.type === section.type);

          const MealIcon = section.icon;

          const mealTotals = meal?.items.reduce(
            (total, item) => {
              total.calories += item.caloriesSnapshot;
              total.protein += item.proteinSnapshot;
              total.carbs += item.carbsSnapshot;
              total.fat += item.fatSnapshot;

              return total;
            },
            {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
            },
          ) ?? {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          };

          const itemCount = meal?.items.length ?? 0;

          return (
            <div key={section.type} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              {/* Meal header */}

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="rounded-lg bg-zinc-800/80 p-2">
                    <MealIcon size={17} className={section.color} />
                  </div>

                  <h3 className="font-semibold text-white">{section.label}</h3>

                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                    {itemCount} {itemCount === 1 ? 'food' : 'foods'}
                  </span>
                </div>

                <button type="button" onClick={() => setActiveMealType(section.type)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-orange-500/40 px-3 py-1.5 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10">
                  <PlusCircle size={15} />
                  Add food
                </button>
              </div>

              {/* Food search */}

              {activeMealType === section.type && (
                <div className="mt-3">
                  <FoodSearch date={selectedDate} mealType={section.type} onClose={() => setActiveMealType(null)} onAdded={() => loadMeals(selectedDate)} />
                </div>
              )}

              {/* Registered food */}

              {meal?.items.length ? (
                <div className="mt-3 divide-y divide-zinc-800">
                  {meal.items.map((item) => {
                    const foodName = item.product?.name ?? item.customFood?.name ?? item.nameSnapshot;

                    const isEditing = editingItemId === item.id;

                    return (
                      <div key={item.id} className="py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{foodName}</p>

                            {isEditing ? (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0.1"
                                  max="10000"
                                  step="0.1"
                                  value={editingQuantity}
                                  onChange={(event) => setEditingQuantity(event.target.value)}
                                  disabled={isSavingItem}
                                  aria-label="Food quantity in grams"
                                  className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white outline-none focus:border-orange-500"
                                />

                                <span className="text-xs text-zinc-500">g</span>

                                <button type="button" onClick={() => void saveQuantity(item.id)} disabled={isSavingItem} aria-label="Save quantity" title="Save quantity" className="rounded-lg p-1.5 text-green-400 transition hover:bg-green-500/10 disabled:opacity-50">
                                  <Check size={17} />
                                </button>

                                <button type="button" onClick={cancelEditing} disabled={isSavingItem} aria-label="Cancel editing" title="Cancel editing" className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 disabled:opacity-50">
                                  <X size={17} />
                                </button>
                              </div>
                            ) : (
                              <p className="mt-0.5 text-xs text-zinc-500">{item.quantity} g</p>
                            )}
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <p className="text-sm font-semibold text-white">{Math.round(item.caloriesSnapshot)} kcal</p>

                            {!isEditing && (
                              <>
                                <button type="button" onClick={() => startEditing(item.id, item.quantity)} disabled={isSavingItem} aria-label={`Edit ${foodName}`} title="Edit quantity" className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-orange-400 disabled:opacity-50">
                                  <Pencil size={15} />
                                </button>

                                <button type="button" onClick={() => void deleteFood(item.id)} disabled={isSavingItem} aria-label={`Remove ${foodName}`} title="Remove food" className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50">
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Macronutrients */}

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="flex items-center gap-1.5 text-zinc-400">
                            <Beef size={13} className="text-blue-400" />
                            Protein:
                            <span className="font-medium text-zinc-200">{item.proteinSnapshot.toFixed(1)} g</span>
                          </span>

                          <span className="flex items-center gap-1.5 text-zinc-400">
                            <Wheat size={13} className="text-green-400" />
                            Carbs:
                            <span className="font-medium text-zinc-200">{item.carbsSnapshot.toFixed(1)} g</span>
                          </span>

                          <span className="flex items-center gap-1.5 text-zinc-400">
                            <Droplets size={13} className="text-purple-400" />
                            Fat:
                            <span className="font-medium text-zinc-200">{item.fatSnapshot.toFixed(1)} g</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Meal total */}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                    <span className="text-xs font-semibold text-zinc-400">Meal total</span>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-semibold text-white">{Math.round(mealTotals.calories)} kcal</span>

                      <span className="text-zinc-400">P: {mealTotals.protein.toFixed(1)} g</span>

                      <span className="text-zinc-400">C: {mealTotals.carbs.toFixed(1)} g</span>

                      <span className="text-zinc-400">F: {mealTotals.fat.toFixed(1)} g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">No food registered yet.</p>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
