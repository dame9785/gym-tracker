'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  selectedDate: string;
  today: string;
  isLoading: boolean;
  isSavingItem: boolean;
  onChangeDate: (date: string) => void;
  onNavigateDate: (days: number) => void;
};

export default function NutritionDateNavigation({ selectedDate, today, isLoading, isSavingItem, onChangeDate, onNavigateDate }: Props) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${selectedDate}T12:00:00`));

  const isDisabled = isLoading || isSavingItem;

  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <CalendarDays size={15} />
          Selected day
        </div>

        <h2 className="mt-1 text-xl font-semibold text-white">{formattedDate}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigateDate(-1)}
          disabled={isDisabled}
          aria-label="Previous day"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:border-orange-500 hover:text-orange-400 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>

        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(event) => {
            if (event.target.value) {
              onChangeDate(event.target.value);
            }
          }}
          disabled={isDisabled}
          className="h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none focus:border-orange-500"
        />

        <button
          type="button"
          onClick={() => onNavigateDate(1)}
          disabled={isDisabled || selectedDate >= today}
          aria-label="Next day"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:border-orange-500 hover:text-orange-400 disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
