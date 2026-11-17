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
  // Meal item editing state
  // --------------------------------------------------

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  function startEditing(itemId: number, quantity: number): void {
    setEditingItemId(itemId);
    setEditingQuantity(String(quantity));
    setError(null);
  }

  function cancelEditing(): void {
    setEditingItemId(null);
    setEditingQuantity('');
  }

  // --------------------------------------------------
  // Load meals
  // --------------------------------------------------

  async function loadMeals(date: string): Promise<MealViewModel[] | null> {
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

  async function calculateNutritionGoals(): Promise<void> {
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
  // Save meal item quantity
  // --------------------------------------------------

  async function saveQuantity(itemId: number, quantity: number): Promise<boolean> {
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

      cancelEditing();

      return true;
    } catch {
      setError('Could not update food quantity.');
      return false;
    } finally {
      setIsSavingItem(false);
    }
  }

  // --------------------------------------------------
  // Delete meal item
  // --------------------------------------------------

  async function deleteFood(itemId: number): Promise<boolean> {
    setIsSavingItem(true);
    setError(null);

    try {
      const result = await removeMealItemAction(itemId);

      if (!result.success) {
        setError(result.message);
        return false;
      }

      setMeals((currentMeals) => currentMeals.map((meal) => (meal.id === result.data.id ? result.data : meal)));

      if (editingItemId === itemId) {
        cancelEditing();
      }

      return true;
    } catch {
      setError('Could not remove food.');
      return false;
    } finally {
      setIsSavingItem(false);
    }
  }

  // --------------------------------------------------
  // Return
  // --------------------------------------------------

  return {
    meals,
    goals,

    isLoading,
    isCalculatingGoals,
    isSavingItem,

    error,

    editingItemId,
    editingQuantity,
    setEditingQuantity,

    startEditing,
    cancelEditing,

    loadMeals,
    calculateNutritionGoals,
    saveQuantity,
    deleteFood,
  };
}
