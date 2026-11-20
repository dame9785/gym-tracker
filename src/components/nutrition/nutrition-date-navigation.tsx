'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

import Button from '@/components/button/button';
import FormInput from '@/components/ui/form-input';

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
        <div className="text-text-muted flex items-center gap-2 text-sm">
          <CalendarDays size={15} />
          Selected day
        </div>

        <h2 className="text-text mt-1 text-xl font-semibold">{formattedDate}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigateDate(-1)}
          disabled={isDisabled}
          ariaLabel="Previous day"
          className="!border-border !text-text-secondary hover:!border-primary hover:!text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition"
        >
          <ChevronLeft size={20} />
        </Button>

        <FormInput
          id="nutrition-date"
          name="date"
          type="date"
          value={selectedDate}
          max={today}
          onChange={(event) => {
            if (event.target.value) {
              onChangeDate(event.target.value);
            }
          }}
          disabled={isDisabled}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigateDate(1)}
          disabled={isDisabled || selectedDate >= today}
          ariaLabel="Next day"
          className="!border-border !text-text-secondary hover:!border-primary hover:!text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </section>
  );
}
