'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { MealType } from '@/types/meal-types';

import { AddMealDto, addMealSchema } from '@/schemas/meal-schemas';
import { toast } from 'sonner';
import Button from '@/components/button/button';
import { createMealAction } from '@/actions/meal-action';
import { FoodViewModel } from '@/types/food-type';

type AddMealFormProps = {
  foods: FoodViewModel[];
};

export default function AddMealForm({ foods }: AddMealFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [foodId, setFoodId] = useState('');
  const [mealType, setMealType] = useState<MealType>('BREAKFAST');
  const [grams, setGrams] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: AddMealDto = {
      foodId: Number(foodId),
      mealType,
      grams: Number(grams),
    };

    const validate = addMealSchema.safeParse(formData);
    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      const response = await createMealAction(validate.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(response.errors);
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/foods');
    } catch (error) {
      console.error('Failed to create food:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSumbit} className="mx-auto w-full max-w-xl space-y-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-400">ADD MEAL</p>

        <h1 className="mt-2 text-2xl font-bold text-white">Add food to your day</h1>

        <p className="mt-1 text-sm text-slate-400">Select a meal, food and amount.</p>
      </div>

      {/* Meal type */}
      <div className="space-y-2">
        <label htmlFor="mealType" className="text-sm font-medium text-slate-300">
          Meal
        </label>

        <select
          id="mealType"
          value={mealType}
          disabled={isSaving}
          onChange={(event) => setMealType(event.target.value as MealType)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        >
          <option value="BREAKFAST">Breakfast</option>
          <option value="LUNCH">Lunch</option>
          <option value="DINNER">Dinner</option>
          <option value="SNACK">Snack</option>
        </select>
        {errors.mealType?.[0] && (
          <p id="mealType-error" className="text-red-500" role="alert">
            {errors.mealType[0]}
          </p>
        )}
      </div>

      {/* Food */}
      <div className="space-y-2">
        <label htmlFor="food" className="text-sm font-medium text-slate-300">
          Food
        </label>

        <select
          id="foodId"
          value={foodId}
          disabled={isSaving}
          onChange={(event) => setFoodId(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        >
          <option value="">Select food</option>

          {foods.map((food) => (
            <option key={food.id} value={food.id}>
              {food.name}
            </option>
          ))}
        </select>
        {errors.foodId?.[0] && (
          <p id="foodId-error" className="text-red-500" role="alert">
            {errors.foodId[0]}
          </p>
        )}
      </div>

      {/* Grams */}
      <div className="space-y-2">
        <label htmlFor="grams" className="text-sm font-medium text-slate-300">
          Amount
        </label>

        <div className="relative">
          <input
            disabled={isSaving}
            id="grams"
            type="number"
            min="1"
            placeholder="Enter grams"
            value={grams}
            onChange={(event) => setGrams(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-14 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">grams</span>
          {errors.grams?.[0] && (
            <p id="grams-error" className="text-red-500" role="alert">
              {errors.grams[0]}
            </p>
          )}
        </div>
      </div>

      {/* Button */}
      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Adding meal...' : 'Add meal'}
      </Button>
    </form>
  );
}
