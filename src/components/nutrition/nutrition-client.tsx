'use client';

import { useState } from 'react';

import type { MealViewModel } from '@/mapping/meal-mapping';
import type { NutritionGoals } from '@/types/nutrition-types';

import NutritionOverview from '@/components/nutrition/nutrition-overview';
import MealSection from '@/components/nutrition/meal-section';
import NutritionDateNavigation from '@/components/nutrition/nutrition-date-navigation';
import NutritionGoalsPrompt from '@/components/nutrition/nutrition-goals-prompt';

import { MEAL_SECTIONS } from '@/constants/nutrition-constants';

import { calculateMealNutrition } from '@/utils/meal-calculations';

import { useNutrition } from '@/hooks/use-nutrition';
import { useNutritionDate } from '@/hooks/use-nutrition-date';

// --------------------------------------------------
// Types
// --------------------------------------------------

type Props = {
  initialMeals: MealViewModel[];
  initialDate: string;
  initialGoals: NutritionGoals;
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function NutritionClient({ initialMeals, initialDate, initialGoals }: Props) {
  const { meals, goals, isLoading, isCalculatingGoals, isSavingItem, error, editingItemId, editingQuantity, setEditingQuantity, startEditing, cancelEditing, loadMeals, calculateNutritionGoals, saveQuantity, deleteFood } = useNutrition({
    initialMeals,
    initialGoals,
  });

  const [activeMealType, setActiveMealType] = useState<MealViewModel['type'] | null>(null);

  // --------------------------------------------------
  // Load meals
  // --------------------------------------------------

  async function handleLoadMeals(date: string): Promise<boolean> {
    const result = await loadMeals(date);

    return result !== null;
  }

  // --------------------------------------------------
  // Date navigation
  // --------------------------------------------------

  const { selectedDate, today, changeDate, navigateDate } = useNutritionDate({
    initialDate,
    onLoadDate: handleLoadMeals,
    onResetEditing: cancelEditing,
    onResetActiveMeal: () => setActiveMealType(null),
  });

  // --------------------------------------------------
  // Food added
  // --------------------------------------------------

  async function handleFoodAdded(): Promise<void> {
    await loadMeals(selectedDate);
  }

  // --------------------------------------------------
  // Calculate daily nutrition
  // --------------------------------------------------

  const totals = calculateMealNutrition(meals.flatMap((meal) => meal.items));

  // --------------------------------------------------
  // Edit meal item quantity
  // --------------------------------------------------

  async function handleSaveQuantity(itemId: number): Promise<void> {
    await saveQuantity(itemId, Number(editingQuantity));
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async function handleDeleteFood(itemId: number): Promise<void> {
    const confirmed = window.confirm('Are you sure you want to remove this food?');

    if (!confirmed) {
      return;
    }

    await deleteFood(itemId);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Date navigation */}

      <NutritionDateNavigation selectedDate={selectedDate} today={today} isLoading={isLoading} isSavingItem={isSavingItem} onChangeDate={(date) => void changeDate(date)} onNavigateDate={navigateDate} />

      {/* Error message */}

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {/* Daily nutrition overview */}

      <NutritionOverview totals={totals} goals={goals} isLoading={isLoading} />

      {/* Calculate nutrition goals */}

      {!goals && <NutritionGoalsPrompt isCalculating={isCalculatingGoals} onCalculate={() => void calculateNutritionGoals()} />}

      {/* Meal sections */}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Meals</h2>

          <p className="mt-1 text-sm text-zinc-400">Your registered food throughout the day.</p>
        </div>

        {MEAL_SECTIONS.map((section) => {
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
              onFoodAdded={handleFoodAdded}
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
