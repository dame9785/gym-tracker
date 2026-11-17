'use client';

import { useState } from 'react';

import { Cookie, Sun, Sunrise, Sunset, Utensils } from 'lucide-react';

import type { MealViewModel } from '@/mapping/meal-mapping';
import type { NutritionGoals } from '@/types/nutrition-types';

import NutritionOverview from '@/components/nutrition/nutrition-overview';
import MealSection from '@/components/nutrition/meal-section';
import NutritionDateNavigation from '@/components/nutrition/nutrition-date-navigation';

import { calculateMealNutrition } from '@/utils/meal-calculations';
import { useNutrition } from '@/hooks/use-nutrition';

import { getTodayDate } from '@/utils/date-utils';

type Props = {
  initialMeals: MealViewModel[];
  initialDate: string;
  initialGoals: NutritionGoals;
};

// --------------------------------------------------
// Constants
// --------------------------------------------------

const mealSections = [
  {
    type: 'BREAKFAST',
    label: 'Breakfast',
    icon: Sunrise,
    color: 'text-orange-400',
  },
  {
    type: 'LUNCH',
    label: 'Lunch',
    icon: Sun,
    color: 'text-yellow-400',
  },
  {
    type: 'DINNER',
    label: 'Dinner',
    icon: Sunset,
    color: 'text-purple-400',
  },
  {
    type: 'SNACK',
    label: 'Snacks',
    icon: Cookie,
    color: 'text-amber-400',
  },
  {
    type: 'OTHER',
    label: 'Other',
    icon: Utensils,
    color: 'text-zinc-400',
  },
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

export default function NutritionClient({ initialMeals, initialDate, initialGoals }: Props) {
  const { meals, goals, isLoading, isCalculatingGoals, isSavingItem, error, setError, loadMeals, calculateNutritionGoals, saveQuantity, deleteFood } = useNutrition({
    initialMeals,
    initialGoals,
  });

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [activeMealType, setActiveMealType] = useState<MealViewModel['type'] | null>(null);

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  const today = getTodayDate();

  // --------------------------------------------------
  // Calculate daily nutrition
  // --------------------------------------------------

  const totals = calculateMealNutrition(meals.flatMap((meal) => meal.items));

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

  async function handleSaveQuantity(itemId: number) {
    const quantity = Number(editingQuantity);

    const success = await saveQuantity(itemId, quantity);

    if (success) {
      cancelEditing();
    }
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async function handleDeleteFood(itemId: number) {
    const confirmed = window.confirm('Are you sure you want to remove this food?');

    if (!confirmed) {
      return;
    }

    const success = await deleteFood(itemId);

    if (success && editingItemId === itemId) {
      cancelEditing();
    }
  }

  // --------------------------------------------------
  // Change date
  // --------------------------------------------------

  function handleChangeDate(date: string) {
    setActiveMealType(null);
    cancelEditing();

    void loadMeals(date).then((result) => {
      if (result) {
        setSelectedDate(date);
      }
    });
  }

  function changeDate(days: number) {
    const date = new Date(`${selectedDate}T12:00:00`);

    date.setDate(date.getDate() + days);

    const nextDate = formatDateInput(date);

    if (nextDate > today) {
      return;
    }

    handleChangeDate(nextDate);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Date navigation */}

      <NutritionDateNavigation selectedDate={selectedDate} today={today} isLoading={isLoading} isSavingItem={isSavingItem} onChangeDate={handleChangeDate} onNavigateDate={changeDate} />

      {/* Error message */}

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {/* Daily nutrition overview */}

      <NutritionOverview totals={totals} goals={goals} isLoading={isLoading} />

      {/* Calculate nutrition goals */}

      {!goals && (
        <section className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
          <h3 className="font-semibold text-white">Your nutrition goals are not set yet</h3>

          <p className="mt-1 text-sm text-zinc-400">Calculate your personal daily calorie and macronutrient targets based on your profile and activity level.</p>

          <button type="button" onClick={() => void calculateNutritionGoals()} disabled={isCalculatingGoals} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50">
            {isCalculatingGoals ? 'Calculating...' : 'Calculate nutrition goals'}
          </button>
        </section>
      )}

      {/* Meal sections */}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Meals</h2>

          <p className="mt-1 text-sm text-zinc-400">Your registered food throughout the day.</p>
        </div>

        {mealSections.map((section) => {
          const meal = meals.find((item) => item.type === section.type);

          return (
            <MealSection
              key={section.type}
              section={section}
              meal={meal}
              date={selectedDate}
              isActive={activeMealType === section.type}
              editingItemId={editingItemId}
              editingQuantity={editingQuantity}
              isSavingItem={isSavingItem}
              onAddFood={() => setActiveMealType(section.type)}
              onCloseFoodSearch={() => setActiveMealType(null)}
              onFoodAdded={() => loadMeals(selectedDate).then(() => {})}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onQuantityChange={setEditingQuantity}
              onSaveQuantity={(itemId) => void handleSaveQuantity(itemId)}
              onDeleteFood={(itemId) => void handleDeleteFood(itemId)}
            />
          );
        })}
      </section>
    </div>
  );
}
