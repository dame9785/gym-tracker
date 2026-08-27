'use client';

import { useState } from 'react';
import { useState } from 'react';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

import FoodSearch from './food-search';
import { calculateFoodNutrition } from '@/helpers/calculate-food-nutrition';

type Food = {
  id: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

type MealItem = {
  id: number;
  food: Food;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function MealBuilder() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState<number>(100);
  const [items, setItems] = useState<MealItem[]>([]);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'>('LUNCH');

  const [isSaving, setIsSaving] = useState(false);

  function handleSelectFood(food: Food) {
    setSelectedFood(food);
    setGrams(100);
  }

  function addFood() {
    if (!selectedFood || grams <= 0) return;

    const nutrition = calculateFoodNutrition(selectedFood, grams);

    const newItem: MealItem = {
      id: Date.now(),
      food: selectedFood,
      grams,
      ...nutrition,
    };

    setItems((previous) => [...previous, newItem]);

    setSelectedFood(null);
    setGrams(100);
  }

  function removeFood(id: number) {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }

  async function handleSaveMeal() {
    if (!mealName.trim()) {
      alert('Skriv ett namn på måltiden');
      return;
    }

    if (items.length === 0) {
      alert('Lägg till minst en matvara');
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: mealName,
          mealType,
          items: items.map((item) => ({
            foodId: item.food.id,
            grams: item.grams,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Kunde inte spara måltiden');
      }

      console.log('Måltid sparad:', result.data);

      alert('Måltiden sparades!');

      // Rensa formuläret
      setMealName('');
      setMealType('LUNCH');
      setItems([]);
      setSelectedFood(null);
      setGrams(100);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsSaving(false);
    }
  }

  const totals = items.reduce<NutritionTotals>(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-card p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-400">LOGGA MÅLTID</p>

        <h2 className="mt-1 text-2xl font-bold">Bygg din måltid</h2>

        <p className="mt-1 text-sm text-muted-foreground">Sök efter mat och ange hur mycket du har ätit.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="meal-name" className="mb-2 block text-sm font-medium text-muted-foreground">
            Måltidsnamn
          </label>

          <input
            id="meal-name"
            type="text"
            value={mealName}
            onChange={(event) => setMealName(event.target.value)}
            placeholder="Ex. Kyckling och ris"
            className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="meal-type" className="mb-2 block text-sm font-medium text-muted-foreground">
            Måltidstyp
          </label>

          <select
            id="meal-type"
            value={mealType}
            onChange={(event) => setMealType(event.target.value as 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK')}
            className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none transition focus:border-blue-500"
          >
            <option value="BREAKFAST">Frukost</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Middag</option>
            <option value="SNACK">Mellanmål</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleSaveMeal}
          disabled={items.length === 0 || isSaving}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sparar måltid...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Spara måltid
            </>
          )}
        </button>
      </div>

      {/* Sök mat */}
      <FoodSearch onSelectFood={handleSelectFood} />

      {/* Vald mat */}
      {selectedFood && (
        <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{selectedFood.name}</p>

              <p className="text-sm text-muted-foreground">Ange mängd</p>
            </div>

            <span className="text-sm text-blue-400">Per 100 g</span>
          </div>

          <div className="mt-4 flex gap-3">
            <input
              type="number"
              min="1"
              value={grams}
              onChange={(event) => setGrams(Number(event.target.value))}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Gram"
            />

            <button
              type="button"
              onClick={addFood}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600"
            >
              <Plus className="h-5 w-5" />
              Lägg till
            </button>
          </div>

          {/* Live preview */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold">{calculateFoodNutrition(selectedFood, grams).calories}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>

            <div>
              <p className="text-lg font-bold">{calculateFoodNutrition(selectedFood, grams).protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>

            <div>
              <p className="text-lg font-bold">{calculateFoodNutrition(selectedFood, grams).carbs}g</p>
              <p className="text-xs text-muted-foreground">Kolhydrater</p>
            </div>

            <div>
              <p className="text-lg font-bold">{calculateFoodNutrition(selectedFood, grams).fat}g</p>
              <p className="text-xs text-muted-foreground">Fett</p>
            </div>
          </div>
        </div>
      )}

      {/* Mat i måltiden */}
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Din måltid</h3>

          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 p-4">
                <div>
                  <p className="font-medium">{item.food.name}</p>

                  <p className="text-sm text-muted-foreground">{item.grams} g</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-blue-400">{item.calories} kcal</p>

                    <p className="text-xs text-muted-foreground">
                      P {item.protein}g · K {item.carbs}g · F {item.fat}g
                    </p>
                  </div>

                  <button type="button" onClick={() => removeFood(item.id)} className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 grid grid-cols-4 gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-400">{Math.round(totals.calories)}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>

            <div>
              <p className="text-xl font-bold">{Math.round(totals.protein)}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>

            <div>
              <p className="text-xl font-bold">{Math.round(totals.carbs)}g</p>
              <p className="text-xs text-muted-foreground">Kolhydrater</p>
            </div>

            <div>
              <p className="text-xl font-bold">{Math.round(totals.fat)}g</p>
              <p className="text-xs text-muted-foreground">Fett</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
