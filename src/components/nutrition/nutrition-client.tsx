'use client';

import { useState } from 'react';

import { Cookie, Sun, Sunrise, Sunset, Utensils } from 'lucide-react';

import { getMealsByDateAction, updateMealItemQuantityAction, removeMealItemAction } from '@/actions/meal-actions';

import { calculateAndSaveNutritionGoalsAction } from '@/actions/goal-actions';

import type { MealViewModel } from '@/mapping/meal-mapping';

import NutritionOverview from '@/components/nutrition/nutrition-overview';
import MealSection from '@/components/nutrition/meal-section';
import NutritionDateNavigation from '@/components/nutrition/nutrition-date-navigation';

import { calculateMealNutrition } from '@/utils/meal-calculations';
import type { NutritionGoals } from '@/types/nutrition-types';

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

function getTodayDate(): string {
  return formatDateInput(new Date());
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function NutritionClient({ initialMeals, initialDate, initialGoals }: Props) {
  const [meals, setMeals] = useState(initialMeals);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [goals, setGoals] = useState(initialGoals);

  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingGoals, setIsCalculatingGoals] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [activeMealType, setActiveMealType] = useState<MealViewModel['type'] | null>(null);

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [isSavingItem, setIsSavingItem] = useState(false);

  const today = getTodayDate();

  // --------------------------------------------------
  // Calculate daily nutrition
  // --------------------------------------------------

  const totals = calculateMealNutrition(meals.flatMap((meal) => meal.items));

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
  // Calculate nutrition goals
  // --------------------------------------------------

  async function calculateNutritionGoals() {
    setIsCalculatingGoals(true);
    setError(null);

    try {
      const result = await calculateAndSaveNutritionGoalsAction();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setGoals(result.data.goal);
    } catch {
      setError('Could not calculate nutrition goals.');
    } finally {
      setIsCalculatingGoals(false);
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
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Date navigation */}
      <NutritionDateNavigation
        selectedDate={selectedDate}
        today={today}
        isLoading={isLoading}
        isSavingItem={isSavingItem}
        onChangeDate={(date) => {
          setActiveMealType(null);
          cancelEditing();
          void loadMeals(date);
        }}
        onNavigateDate={changeDate}
      />

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
              onFoodAdded={() => loadMeals(selectedDate)}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onQuantityChange={setEditingQuantity}
              onSaveQuantity={(itemId) => void saveQuantity(itemId)}
              onDeleteFood={(itemId) => void deleteFood(itemId)}
            />
          );
        })}
      </section>
    </div>
  );
}
