'use client';

import { useEffect } from 'react';

import type { MealViewModel } from '@/mapping/meal-mapping';

import FoodSearch from '@/components/nutrition/food-search';

// --------------------------------------------------
// Types
// --------------------------------------------------

type Props = {
  mealType: MealViewModel['type'];
  mealLabel: string;
  date: string;
  onClose: () => void;
  onAdded: () => Promise<void>;
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function FoodModal({ mealType, mealLabel, date, onClose, onAdded }: Props) {
  // --------------------------------------------------
  // Modal behavior
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={`Add food to ${mealLabel}`} className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 p-4 shadow-2xl sm:p-6">
        <FoodSearch date={date} mealType={mealType} onClose={onClose} onAdded={onAdded} />
      </div>
    </div>
  );
}
