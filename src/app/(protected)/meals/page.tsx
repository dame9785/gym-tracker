import MealService from '@/services/meal-service';
import MealList from '@/components/meals/meal-list';
import MealCalendar from '@/components/meals/meal-calandar';

import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ErrorMessage from '@/components/ui/error-message';

const mealService = new MealService();

type MealsPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default async function MealsPage({ searchParams }: MealsPageProps) {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const { date } = await searchParams;

  // Om inget datum finns i URL:en använder vi idag
  const selectedDate = date ? new Date(`${date}T12:00:00`) : new Date();

  const formattedDate = formatDate(selectedDate);

  // Föregående dag
  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const previousDateString = formatDate(previousDate);

  // Nästa dag
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const nextDateString = formatDate(nextDate);

  // Hämta meals för valt datum
  const response = await mealService.getMealsByDate(token, formattedDate);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const { totals, meals, goal } = response.data;
  console.log(meals);

  const displayDate = selectedDate.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const todayString = formatDate(new Date());

  const isToday = formattedDate === todayString;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Daily overview</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Nutrition</h1>

          <p className="mt-1 text-sm text-slate-400">Track your meals and daily nutrition.</p>
        </div>

        <Link href="/meals/add" className="rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-orange-400">
          + Add meal
        </Link>
      </header>

      {/* Date navigation */}
      <section className="mt-6 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-3">
        <Link href={`/meals?date=${previousDateString}`} className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
          ← Föregående
        </Link>

        <div className="text-center">
          <p className="text-sm font-semibold capitalize text-white">{displayDate}</p>

          {isToday && <span className="text-xs text-orange-400">Idag</span>}
        </div>

        <Link href={`/meals?date=${nextDateString}`} className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
          Nästa →
        </Link>
      </section>

      {/* Go back to today */}
      {!isToday && (
        <div className="mt-3 text-center">
          <Link href="/meals" className="text-sm text-orange-400 transition hover:text-orange-300">
            Gå tillbaka till idag
          </Link>
        </div>
      )}

      {/* Nutrition cards */}
      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Calories */}
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-4">
          <span className="text-xs text-slate-400">Calories</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.calories.toFixed(0)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.calories}
          </strong>

          <span className="text-[11px] text-slate-500">kcal</span>
        </div>

        {/* Protein */}
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-4">
          <span className="text-xs text-slate-400">Protein</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.protein.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.protein}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>

        {/* Carbs */}
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-4">
          <span className="text-xs text-slate-400">Carbs</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.carbs.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.carbs}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>

        {/* Fat */}
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-4">
          <span className="text-xs text-slate-400">Fat</span>

          <strong className="mt-1 block text-lg font-bold text-white">
            {totals.fat.toFixed(1)}
            <span className="mx-1 text-sm text-slate-500">/</span>
            {goal.fat}
          </strong>

          <span className="text-[11px] text-slate-500">grams</span>
        </div>
      </section>

      {/* Meals + Calendar */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        {/* LEFT SIDE - MEALS */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your meals</p>

              <h2 className="text-lg font-semibold text-white">{isToday ? 'Todays meals' : 'Meals'}</h2>
            </div>

            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">{meals.length} meals</span>
          </div>

          <MealList meals={meals} />
        </div>

        {/* RIGHT SIDE - CALENDAR */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <MealCalendar selectedDate={selectedDate} />
        </aside>
      </section>
    </main>
  );
}
