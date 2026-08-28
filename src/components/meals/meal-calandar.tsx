'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type MealCalendarProps = {
  selectedDate: Date;
};

export default function MealCalendar({ selectedDate }: MealCalendarProps) {
  const router = useRouter();

  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  });

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function handleSelectDate(date: Date) {
    const formattedDate = formatDate(date);

    router.push(`/meals?date=${formattedDate}`);
  }

  function changeMonth(amount: number) {
    setCurrentMonth((previousMonth) => {
      return new Date(previousMonth.getFullYear(), previousMonth.getMonth() + amount, 1);
    });
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);

  // Måndag som första dag
  const startingDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: startingDay + daysInMonth }, (_, index) => {
    if (index < startingDay) {
      return null;
    }

    return index - startingDay + 1;
  });

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      {/* Månad */}
      <h2 className="mb-6 text-center text-lg font-semibold capitalize text-white">
        {currentMonth.toLocaleDateString('sv-SE', {
          month: 'long',
          year: 'numeric',
        })}
      </h2>

      {/* Veckodagar */}
      <div className="mb-3 grid grid-cols-7 text-center">
        {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day) => (
          <div key={day} className="text-xs font-semibold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Datum */}
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const date = new Date(year, month, day);

          const isSelected =
            date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();

          const today = new Date();

          const isToday = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();

          return (
            <div key={day} className="flex justify-center">
              <button
                type="button"
                onClick={() => handleSelectDate(date)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-orange-500 text-black'
                    : isToday
                      ? 'border border-orange-400 text-orange-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          ← Föregående
        </button>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Nästa →
        </button>
      </div>
    </section>
  );
}
