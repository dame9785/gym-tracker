'use client';

import { useState } from 'react';

import { getMealsByDateAction, updateMealItemQuantityAction, removeMealItemAction } from '@/actions/meal-actions';

import { calculateAndSaveNutritionGoalsAction } from '@/actions/goal-actions';

import type { MealViewModel } from '@/mapping/meal-mapping';
import type { NutritionGoals } from '@/types/nutrition-types';

// --------------------------------------------------
// Types
// --------------------------------------------------

type Props = {
  initialMeals: MealViewModel[];
  initialGoals: NutritionGoals;
};

// --------------------------------------------------
// Hook
// --------------------------------------------------

export function useNutrition({ initialMeals, initialGoals }: Props) {
  const [meals, setMeals] = useState(initialMeals);
  const [goals, setGoals] = useState(initialGoals);

  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingGoals, setIsCalculatingGoals] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // Load meals
  // --------------------------------------------------

  async function loadMeals(date: string) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMealsByDateAction(date);

      if (!result.success) {
        setError(result.message);
        return null;
      }

      setMeals(result.data);

      return result.data;
    } catch {
      setError('Could not load meals.');
      return null;
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
  // Update meal item quantity
  // --------------------------------------------------

  async function saveQuantity(itemId: number, quantity: number) {
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000) {
      setError('Enter a valid quantity between 0 and 10000 grams.');
      return false;
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
        return false;
      }

      setMeals((currentMeals) => currentMeals.map((meal) => (meal.id === result.data.id ? result.data : meal)));

      return true;
    } catch {
      setError('Could not update food quantity.');
      return false;
    } finally {
      setIsSavingItem(false);
    }
  }

  // --------------------------------------------------
  // Remove meal item
  // --------------------------------------------------

  async function deleteFood(itemId: number) {
    setIsSavingItem(true);
    setError(null);

    try {
      const result = await removeMealItemAction(itemId);

      if (!result.success) {
        setError(result.message);
        return false;
      }

      setMeals((currentMeals) => currentMeals.map((meal) => (meal.id === result.data.id ? result.data : meal)));

      return true;
    } catch {
      setError('Could not remove food.');
      return false;
    } finally {
      setIsSavingItem(false);
    }
  }

  return {
    meals,
    goals,
    isLoading,
    isCalculatingGoals,
    isSavingItem,
    error,
    setError,
    loadMeals,
    calculateNutritionGoals,
    saveQuantity,
    deleteFood,
  };
}
