'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

type Food = {
  id: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

type Props = {
  onSelectFood: (food: Food) => void;
};

export default function FoodSearch({ onSelectFood }: Props) {
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        setFoods([]);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(`/api/foods?search=${encodeURIComponent(search)}`);

        const result = await response.json();

        if (result.success) {
          setFoods(result.data);
        }
      } catch (error) {
        console.error('Kunde inte söka efter mat:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectFood(food: Food) {
    onSelectFood(food);

    // Rensa sökningen efter val
    setSearch('');
    setFoods([]);
  }

  return (
    <div className="space-y-3">
      <label htmlFor="food-search" className="text-sm font-medium text-muted-foreground">
        Sök efter mat
      </label>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          id="food-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ex. kyckling, ris, havregryn..."
          className="w-full rounded-xl border border-white/10 bg-background py-3 pr-10 pl-10 outline-none transition focus:border-blue-500"
        />

        {isLoading && <Loader2 className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 animate-spin text-blue-400" />}
      </div>

      {foods.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10">
          {foods.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => handleSelectFood(food)}
              className="flex w-full items-center justify-between border-b border-white/5 p-4 text-left transition last:border-0 hover:bg-white/5"
            >
              <div>
                <p className="font-medium">{food.name}</p>

                <p className="mt-1 text-xs text-muted-foreground">Per 100 g</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-blue-400">{food.caloriesPer100g} kcal</p>

                <p className="text-xs text-muted-foreground">
                  P {food.proteinPer100g}g · K {food.carbsPer100g}g · F {food.fatPer100g}g
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && search.trim() && foods.length === 0 && <p className="text-sm text-muted-foreground">Ingen mat hittades.</p>}
    </div>
  );
}
