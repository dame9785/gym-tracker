'use client';

import { useState, useTransition } from 'react';
import Button from '@/components/button/button';

import { searchFoodsAction, importExternalFoodByIdAction, deleteFoodAction, createManualFoodAction } from '@/actions/food-actions';

import FoodCard from './food-card';
import type { ProductService } from '@/services/product-service';

import type { ExternalFood } from '@/lib/food-providers/food-provider';
import type { FoodService } from '@/services/food-service';

type Props = {
  initialFoods: Awaited<ReturnType<FoodService['getAllFoods']>>;
  initialFeaturedFoods: Awaited<ReturnType<FoodService['getFeaturedFoods']>>;
  initialProducts: Awaited<ReturnType<ProductService['getAllProducts']>>;
};

type SearchResult = Awaited<ReturnType<typeof searchFoodsAction>>;

type FoodFilter = 'ALL' | 'LOCAL' | 'IMPORTED' | 'LIVSMEDELSVERKET';

type FoodSort = 'NAME' | 'CALORIES' | 'NEWEST';

export default function FoodSearch({ initialFoods, initialFeaturedFoods, initialProducts }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [savedFoods, setSavedFoods] = useState(initialFoods);
  const [sharedProducts] = useState(initialProducts);

  const [libraryQuery, setLibraryQuery] = useState('');
  const [foodFilter, setFoodFilter] = useState<FoodFilter>('ALL');
  const [foodSort, setFoodSort] = useState<FoodSort>('NAME');

  const [isPending, startTransition] = useTransition();
  const [importingId, setImportingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [isCreatingFood, setIsCreatingFood] = useState(false);

  const [manualFood, setManualFood] = useState({
    name: '',
    brand: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: '',
  });

  const handleCreateManualFood = async () => {
    setIsCreatingFood(true);
    setMessage(null);

    try {
      const response = await createManualFoodAction({
        name: manualFood.name,
        brand: manualFood.brand || null,
        caloriesPer100g: Number(manualFood.caloriesPer100g),
        proteinPer100g: Number(manualFood.proteinPer100g),
        carbsPer100g: Number(manualFood.carbsPer100g),
        fatPer100g: Number(manualFood.fatPer100g),
      });

      if (!response.success || !response.data) {
        setMessage(response.success ? 'Kunde inte spara livsmedlet.' : response.message);
        return;
      }

      setSavedFoods((currentFoods) => [...currentFoods.filter((food) => food.id !== response.data!.id), response.data!]);

      setManualFood({
        name: '',
        brand: '',
        caloriesPer100g: '',
        proteinPer100g: '',
        carbsPer100g: '',
        fatPer100g: '',
      });

      setIsManualFormOpen(false);
      setMessage('Livsmedlet har sparats!');

      if (query.trim().length >= 2) {
        const searchResponse = await searchFoodsAction(query);

        if (searchResponse.success) {
          setResult(searchResponse);
        }
      }
    } catch {
      setMessage('Kunde inte spara livsmedlet. Försök igen.');
    } finally {
      setIsCreatingFood(false);
    }
  };

  const filteredFoods = savedFoods
    .filter((food) => {
      const matchesQuery = `${food.name} ${food.brand ?? ''}`.toLowerCase().includes(libraryQuery.trim().toLowerCase());

      const matchesFilter = foodFilter === 'ALL' || (foodFilter === 'LOCAL' && food.source === 'LOCAL') || (foodFilter === 'IMPORTED' && food.source !== 'LOCAL') || food.source === foodFilter;

      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => {
      switch (foodSort) {
        case 'CALORIES':
          return a.caloriesPer100g - b.caloriesPer100g;

        case 'NEWEST':
          return b.createdAt.getTime() - a.createdAt.getTime();

        default:
          return a.name.localeCompare(b.name, 'sv');
      }
    });

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
      const response = await importExternalFoodByIdAction('LIVSMEDELSVERKET', food.externalId);

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

  const externalFoods = result?.success && result.data ? result.data.externalFoods : initialFeaturedFoods;

  const livsmedelsverketFoods = externalFoods.filter((food) => food.source === 'LIVSMEDELSVERKET');

  return (
    <section className="space-y-10">
      {/* My Food Library */}
      <section className="space-y-5">
        {/* Library filters */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            type="search"
            value={libraryQuery}
            onChange={(event) => setLibraryQuery(event.target.value)}
            placeholder="Search your food library..."
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
          />

          <select value={foodFilter} onChange={(event) => setFoodFilter(event.target.value as FoodFilter)} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none">
            <option value="ALL">All foods</option>
            <option value="LOCAL">My foods</option>
            <option value="IMPORTED">Imported foods</option>

            <option value="LIVSMEDELSVERKET">Livsmedelsverket</option>
          </select>

          <select value={foodSort} onChange={(event) => setFoodSort(event.target.value as FoodSort)} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none">
            <option value="NAME">Sort by name</option>
            <option value="CALORIES">Sort by calories</option>
            <option value="NEWEST">Newest first</option>
          </select>
        </div>

        {/* Saved foods */}
        {savedFoods.length > 0 ? (
          filteredFoods.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFoods.map((food) => (
                <article key={food.id} className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5">
                  {/* Product header */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                      {food.imageUrl ? (
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="size-full object-contain p-1"
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
                      <span className="inline-flex rounded border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-orange-400 uppercase">
                        {food.source === 'LIVSMEDELSVERKET' ? 'Livsmedelsverket' : food.source === 'LOCAL' ? 'Eget livsmedel' : food.source === 'GENERIC' ? 'Generiskt livsmedel' : 'Äldre importerat livsmedel'}
                      </span>

                      <h3 className="mt-1 truncate text-sm font-semibold text-white">{food.name}</h3>

                      {food.brand && <p className="mt-0.5 truncate text-xs text-zinc-500">{food.brand}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(food.id, food.name)}
                      disabled={deletingId === food.id}
                      aria-label={`Ta bort ${food.name}`}
                      title="Ta bort livsmedel"
                      className="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === food.id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Nutrition values */}
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {[
                      {
                        label: 'Kalorier',
                        value: food.caloriesPer100g,
                        unit: 'kcal',
                        color: 'text-orange-400',
                      },
                      {
                        label: 'Protein',
                        value: food.proteinPer100g,
                        unit: 'g',
                        color: 'text-blue-400',
                      },
                      {
                        label: 'Kolhydrater',
                        value: food.carbsPer100g,
                        unit: 'g',
                        color: 'text-amber-400',
                      },
                      {
                        label: 'Fett',
                        value: food.fatPer100g,
                        unit: 'g',
                        color: 'text-emerald-400',
                      },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-1 py-2 text-center">
                        <p className="text-[10px] text-zinc-500">{item.label}</p>

                        <p className={`mt-1 text-sm font-bold ${item.color}`}>{Number(item.value.toFixed(1))}</p>

                        <p className="text-[9px] text-zinc-600">{item.unit}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 mt-auto border-t border-zinc-800 pt-2 text-right">
                    <span className="text-[10px] text-zinc-500">Näringsvärde per 100 g</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-6 py-10 text-center">
              <p className="text-sm text-zinc-400">Inga livsmedel matchar din sökning eller filtrering.</p>
            </div>
          )
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

      {/* Shared Product Library */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Gemensamma produkter</h2>
            <p className="mt-1 text-sm text-zinc-400">Märkesprodukter som är tillgängliga för alla användare.</p>
          </div>

          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">{sharedProducts.length} produkter</span>
        </div>

        {sharedProducts.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sharedProducts.map((product) => (
              <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="size-full object-contain p-1" />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">
                        🥛
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-blue-400 uppercase">Gemensam produkt</span>

                    <h3 className="mt-1 truncate text-sm font-semibold text-white">{product.name}</h3>

                    <p className="mt-0.5 truncate text-xs text-zinc-500">{product.brand}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {[
                    {
                      label: 'Kalorier',
                      value: product.caloriesPer100g,
                      unit: 'kcal',
                      color: 'text-orange-400',
                    },
                    {
                      label: 'Protein',
                      value: product.proteinPer100g,
                      unit: 'g',
                      color: 'text-blue-400',
                    },
                    {
                      label: 'Kolhydrater',
                      value: product.carbsPer100g,
                      unit: 'g',
                      color: 'text-amber-400',
                    },
                    {
                      label: 'Fett',
                      value: product.fatPer100g,
                      unit: 'g',
                      color: 'text-emerald-400',
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-1 py-2 text-center">
                      <p className="text-[10px] text-zinc-500">{item.label}</p>

                      <p className={`mt-1 text-sm font-bold ${item.color}`}>{Number(item.value.toFixed(1))}</p>

                      <p className="text-[9px] text-zinc-600">{item.unit}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-zinc-800 pt-2 text-right">
                  <span className="text-[10px] text-zinc-500">Näringsvärde per 100 g</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Inga gemensamma produkter finns ännu.</p>
        )}
      </section>

      {/* Search */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Add New Foods</h2>
          <p className="mt-1 text-sm text-zinc-400">Sök bland svenska livsmedel från Livsmedelsverket.</p>{' '}
        </div>

        {/* Search input */}
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

          <Button variant="primary" size="sm" loading={isPending} disabled={query.trim().length < 2} onClick={handleSearch}>
            {isPending ? 'Söker...' : 'Sök'}
          </Button>
        </div>

        <div>
          <button type="button" onClick={() => setIsManualFormOpen((open) => !open)} className="text-sm font-medium text-orange-400 transition hover:text-orange-300">
            {isManualFormOpen ? '− Avbryt manuell registrering' : '+ Hittar du inte livsmedlet? Lägg till manuellt'}
          </button>
        </div>

        {isManualFormOpen && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateManualFood();
            }}
            className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
          >
            <div>
              <h3 className="font-semibold text-white">Lägg till eget livsmedel</h3>
              <p className="mt-1 text-xs text-zinc-500">Ange näringsvärden per 100 gram.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                maxLength={191}
                placeholder="Produktnamn *"
                value={manualFood.name}
                onChange={(event) => setManualFood({ ...manualFood, name: event.target.value })}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
              />

              <input
                type="text"
                maxLength={191}
                placeholder="Varumärke (valfritt)"
                value={manualFood.brand}
                onChange={(event) => setManualFood({ ...manualFood, brand: event.target.value })}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
              />

              {(
                [
                  ['caloriesPer100g', 'Kalorier (kcal) *'],
                  ['proteinPer100g', 'Protein (g) *'],
                  ['carbsPer100g', 'Kolhydrater (g) *'],
                  ['fatPer100g', 'Fett (g) *'],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="space-y-1">
                  <span className="text-xs text-zinc-400">{label}</span>
                  <input
                    type="number"
                    required
                    min="0"
                    max="1000"
                    step="any"
                    value={manualFood[field]}
                    onChange={(event) => setManualFood({ ...manualFood, [field]: event.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </label>
              ))}
            </div>

            <button type="submit" disabled={isCreatingFood || !manualFood.name.trim()} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
              {isCreatingFood ? 'Sparar...' : 'Spara livsmedel'}
            </button>
          </form>
        )}

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
        {((result?.success && result.data) || (!result && initialFeaturedFoods.length > 0)) && (
          <div className="space-y-8">
            <p className="text-sm text-zinc-500">{externalFoods.length} externa resultat</p>

            {/* Livsmedelsverket */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-1 rounded-full bg-orange-500" />

                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white">Svenska livsmedel</h3>

                    <p className="mt-0.5 text-xs text-zinc-500">Näringsdata från Livsmedelsverket</p>
                  </div>
                </div>

                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">{livsmedelsverketFoods.length} resultat</span>
              </div>

              {livsmedelsverketFoods.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {livsmedelsverketFoods.map((food) => (
                    <FoodCard key={`${food.source}:${food.externalId}`} food={food} onImport={handleImport} isImporting={importingId === `${food.source}:${food.externalId}`} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Inga svenska livsmedel hittades.</p>
              )}
            </section>

            {result?.success && result.data?.externalSearchFailed && <p className="text-sm text-red-400">Externa livsmedelskällor kunde inte nås.</p>}
          </div>
        )}
      </section>
    </section>
  );
}
