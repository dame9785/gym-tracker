'use client';

import { useState, useTransition } from 'react';

import { searchFoodsAction, importExternalFoodByIdAction, deleteFoodAction } from '@/actions/food-actions';

import FoodCard from './food-card';

import type { ExternalFood } from '@/lib/food-providers/food-provider';
import type { FoodService } from '@/services/food-service';

type Props = {
  initialFoods: Awaited<ReturnType<FoodService['getAllFoods']>>;
};

type SearchResult = Awaited<ReturnType<typeof searchFoodsAction>>;

export default function FoodSearch({ initialFoods }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [savedFoods, setSavedFoods] = useState(initialFoods);

  const [isPending, startTransition] = useTransition();
  const [importingId, setImportingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSearch = () => {
    if (query.trim().length < 2) return;

    setMessage(null);

    startTransition(async () => {
      const response = await searchFoodsAction(query);
      setResult(response);
    });
  };

  const handleImport = async (food: ExternalFood) => {
    setImportingId(`${food.source}:${food.externalId}`);
    setMessage(null);

    try {
      const response = await importExternalFoodByIdAction(food.source as 'OPEN_FOOD_FACTS' | 'LIVSMEDELSVERKET', food.externalId);

      if (!response.success || !response.data) {
        setMessage(response.success ? 'Kunde inte importera livsmedlet.' : response.message);
        return;
      }

      setSavedFoods((currentFoods) => [...currentFoods.filter((item) => item.id !== response.data!.id), response.data!]);

      setMessage(`${food.name} har importerats!`);

      const searchResponse = await searchFoodsAction(query);

      if (searchResponse.success) {
        setResult(searchResponse);
      }
    } catch {
      setMessage('Kunde inte importera livsmedlet.');
    } finally {
      setImportingId(null);
    }
  };

  const handleDelete = async (foodId: number, foodName: string) => {
    const confirmed = window.confirm(`Vill du verkligen ta bort ${foodName} från dina livsmedel?`);

    if (!confirmed) return;

    setDeletingId(foodId);
    setMessage(null);

    try {
      const response = await deleteFoodAction(foodId);

      if (!response.success) {
        setMessage(response.message);
        return;
      }

      setSavedFoods((currentFoods) => currentFoods.filter((food) => food.id !== foodId));

      setMessage(`${foodName} har tagits bort!`);

      const searchResponse = await searchFoodsAction(query);

      if (searchResponse.success) {
        setResult(searchResponse);
      }
    } catch {
      setMessage('Kunde inte ta bort livsmedlet.');
    } finally {
      setDeletingId(null);
    }
  };

  const livsmedelsverketFoods = result?.success && result.data ? result.data.externalFoods.filter((food) => food.source === 'LIVSMEDELSVERKET') : [];

  const openFoodFactsFoods = result?.success && result.data ? result.data.externalFoods.filter((food) => food.source === 'OPEN_FOOD_FACTS') : [];

  return (
    <section className="space-y-10">
      {/* My Food Library */}
      <section className="space-y-5">
        {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">My Food Library</h2>

            <p className="mt-1 text-sm text-zinc-400">Dina sparade livsmedel och deras näringsvärden.</p>
          </div>

          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">{savedFoods.length} foods</span>
        </div> */}

        {savedFoods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedFoods.map((food) => (
              <article key={food.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700">
                <div className="flex items-start gap-3">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-800">
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="size-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">
                        🍎
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">{food.name}</h3>

                    {food.brand && <p className="mt-1 truncate text-xs text-zinc-400">{food.brand}</p>}

                    <p className="mt-1 text-xs text-zinc-500">{food.source === 'OPEN_FOOD_FACTS' ? 'Open Food Facts' : food.source === 'LIVSMEDELSVERKET' ? 'Livsmedelsverket' : food.source === 'USDA' ? 'USDA' : 'Lokalt'}</p>
                  </div>

                  <button type="button" onClick={() => handleDelete(food.id, food.name)} disabled={deletingId === food.id} aria-label={`Ta bort ${food.name}`} className="shrink-0 text-xs font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50">
                    {deletingId === food.id ? 'Tar bort...' : 'Ta bort'}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-4 border-t border-zinc-800 pt-4 sm:grid-cols-4">
                  {[
                    {
                      label: 'Kalorier',
                      value: food.caloriesPer100g,
                      unit: 'kcal',
                    },
                    {
                      label: 'Protein',
                      value: food.proteinPer100g,
                      unit: 'g',
                    },
                    {
                      label: 'Kolhydrater',
                      value: food.carbsPer100g,
                      unit: 'g',
                    },
                    {
                      label: 'Fett',
                      value: food.fatPer100g,
                      unit: 'g',
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-zinc-500">{item.label}</p>

                      <p className="mt-1 font-semibold text-white">
                        {Number(item.value.toFixed(1))}
                        <span className="ml-1 text-xs font-normal text-zinc-500">{item.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-right text-[11px] text-zinc-500">Per 100 g</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-6 py-12 text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">
              🥗
            </div>

            <h3 className="font-semibold text-white">Ditt bibliotek är tomt</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">Sök efter livsmedel nedan och importera dina första produkter för att bygga upp ditt personliga livsmedelsbibliotek.</p>
          </div>
        )}
      </section>

      {/* Search */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Add New Foods</h2>

          <p className="mt-1 text-sm text-zinc-400">Sök bland svenska livsmedel och internationella märkesprodukter.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
            placeholder="Sök livsmedel, exempelvis havregryn..."
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-orange-500"
          />

          <button type="button" onClick={handleSearch} disabled={isPending || query.trim().length < 2} className="min-h-12 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
            {isPending ? 'Söker...' : 'Sök livsmedel'}
          </button>
        </div>

        {/* Feedback */}
        {message && (
          <p className="text-sm text-zinc-300" role="status">
            {message}
          </p>
        )}

        {result && !result.success && (
          <p className="text-sm text-red-400" role="alert">
            {result.message}
          </p>
        )}

        {/* External Search Results */}
        {result?.success && result.data && (
          <div className="space-y-8">
            <p className="text-sm text-zinc-500">{result.data.externalFoods.length} externa resultat</p>

            {/* Livsmedelsverket */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Svenska livsmedel</h3>

              {livsmedelsverketFoods.length > 0 ? (
                <div className="grid gap-3 lg:grid-cols-2">
                  {livsmedelsverketFoods.map((food) => (
                    <FoodCard key={`${food.source}:${food.externalId}`} food={food} onImport={handleImport} isImporting={importingId === `${food.source}:${food.externalId}`} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Inga svenska livsmedel hittades.</p>
              )}
            </section>

            {/* Open Food Facts */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Märkesprodukter</h3>

              {openFoodFactsFoods.length > 0 ? (
                <div className="grid gap-3 lg:grid-cols-2">
                  {openFoodFactsFoods.map((food) => (
                    <FoodCard key={`${food.source}:${food.externalId}`} food={food} onImport={handleImport} isImporting={importingId === `${food.source}:${food.externalId}`} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Inga märkesprodukter hittades.</p>
              )}
            </section>

            {result.data.externalSearchFailed && <p className="text-sm text-red-400">Externa livsmedelskällor kunde inte nås.</p>}
          </div>
        )}
      </section>
    </section>
  );
}
