import MealService from '@/services/meal-service';
import MealList from '@/components/meals/meal-list';

import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const mealService = new MealService();

export default async function MealsPage() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await mealService.getTodayMeals(token);

  if (!response.success || !response.data) {
    return (
      <main className="mx-auto w-full max-w-5xl p-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">Could not load meals.</div>
      </main>
    );
  }

  const { totals, meals, goal } = response.data;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Todays overview</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Todays Nutrition</h1>

          <p className="mt-1 text-sm text-slate-400">Track your meals and daily nutrition.</p>
        </div>

        <Link href="/meals/add" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400">
          + Add meal
        </Link>
      </header>

      {/* Nutrition cards */}
      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3">
          <span className="text-xs text-slate-400">Calories</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.calories.toFixed(0)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.calories}
          </strong>

          <span className="text-[11px] text-slate-500">kcal</span>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3">
          <span className="text-xs text-slate-400">Protein</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.protein.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.protein}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3">
          <span className="text-xs text-slate-400">Carbs</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.carbs.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.carbs}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3">
          <span className="text-xs text-slate-400">Fat</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.fat.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.fat}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>
      </section>

      {/* Meals */}
      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your meals</p>

            <h2 className="text-lg font-semibold text-white">Todays meals</h2>
          </div>

          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">{meals.length} meals</span>
        </div>

        <MealList meals={meals} />
      </section>
    </main>
  );
}
