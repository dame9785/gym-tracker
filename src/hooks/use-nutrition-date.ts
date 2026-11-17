'use client';

import { useState } from 'react';

import { getTodayDate } from '@/utils/date-utils';

type Props = {
  initialDate: string;
  onLoadDate: (date: string) => Promise<boolean>;
  onResetEditing: () => void;
  onResetActiveMeal: () => void;
};

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function useNutritionDate({ initialDate, onLoadDate, onResetEditing, onResetActiveMeal }: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const today = getTodayDate();

  async function changeDate(date: string): Promise<void> {
    if (date > today) {
      return;
    }

    onResetActiveMeal();
    onResetEditing();

    const success = await onLoadDate(date);

    if (success) {
      setSelectedDate(date);
    }
  }

  function navigateDate(days: number): void {
    const date = new Date(`${selectedDate}T12:00:00`);

    date.setDate(date.getDate() + days);

    const nextDate = formatDateInput(date);

    if (nextDate > today) {
      return;
    }

    void changeDate(nextDate);
  }

  return {
    selectedDate,
    today,
    changeDate,
    navigateDate,
  };
}
