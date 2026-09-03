import { MealService } from '@/services-server/meal-service';
import MealList from '@/components/meals/meal-list';
import MealCalendar from '@/components/meals/meal-calandar';

import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import ErrorMessage from '@/components/ui/error-message';
import TotalNuitrationStats from '@/components/meals/total-nuitration-stats';

import { formatDate, addDays } from '@/helpers/date-helper';

const mealService = new MealService();

type MealsPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function MealsPage({ searchParams }: MealsPageProps) {
  // Kontrollera att användaren är inloggad
  const user = await requireAuth();

  const { date } = await searchParams;

  // Om inget datum finns i URL:en använder vi idag
  const selectedDate = date ? new Date(`${date}T12:00:00`) : new Date();

  // Formaterat valt datum
  const formattedDate = formatDate(selectedDate);

  const previousDateString = formatDate(addDays(selectedDate, -1));
  const nextDateString = formatDate(addDays(selectedDate, 1));

  // Hämta meals för valt datum
  const response = await mealService.getMealsByDate(formattedDate, user.userId);
  console.log('RESPONSE', response);

  // Hantera fel
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load foods"
          message={response.message ?? 'Something went wrong while loading your foods.'}
        />
      </main>
    );
  }

  const { totals, meals, dailyIntakeGoals } = response.data;
  console.log('MEALS', meals);

  // Datum som visas för användaren
  const displayDate = selectedDate.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Kontrollera om valt datum är idag
  const todayString = formatDate(new Date());

  const isToday = formattedDate === todayString;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Daily overview</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Nutrition</h1>

          <p className="mt-1 text-sm text-slate-400">Track your meals and daily nutrition.</p>
        </div>

        <Link
          href="/meals/add"
          className="rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-orange-400"
        >
          + Add meal
        </Link>
      </header>

      {/* Date navigation */}
      <section className="mt-6 flex items-center justify-between rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-950 p-6 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5">
        <Link
          href={`/meals?date=${previousDateString}`}
          className="rounded-lg px-3 py-2 text-lg font-bold transition hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5"
        >
          ← Previous
        </Link>

        <div className="text-center">
          <p className="text-lg font-bold">{displayDate}</p>

          {isToday && <span className="text-xs text-orange-400">Idag</span>}
        </div>

        <Link
          href={`/meals?date=${nextDateString}`}
          className="rounded-lg px-3 py-2 text-lg font-bold transition hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5"
        >
          Next →
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
      <TotalNuitrationStats totalNuitrationsStats={totals} recomendedIntakeStats={dailyIntakeGoals} />

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
              {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
            </span>
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
