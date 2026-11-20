'use client';

import { useEffect } from 'react';

import type { MealViewModel } from '@/mapping/meal-mapping';

import FoodSearch from '@/components/nutrition/food-search';

type Props = {
  mealType: MealViewModel['type'];
  mealLabel: string;
  date: string;
  onClose: () => void;
  onAdded: () => Promise<void>;
};

export default function FoodModal({ mealType, mealLabel, date, onClose, onAdded }: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Add food to ${mealLabel}`}
        className="border-border bg-background flex h-full max-h-[900px] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-2xl border p-3 shadow-2xl sm:p-5"
      >
        <FoodSearch date={date} mealType={mealType} onClose={onClose} onAdded={onAdded} />
      </div>
    </div>
  );
}
