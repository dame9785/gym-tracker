import { Cookie, Sun, Sunrise, Sunset, Utensils } from 'lucide-react';

export const MEAL_SECTIONS = [
  {
    type: 'BREAKFAST',
    label: 'Breakfast',
    icon: Sunrise,
    color: 'text-orange-400',
  },
  {
    type: 'LUNCH',
    label: 'Lunch',
    icon: Sun,
    color: 'text-yellow-400',
  },
  {
    type: 'DINNER',
    label: 'Dinner',
    icon: Sunset,
    color: 'text-purple-400',
  },
  {
    type: 'SNACK',
    label: 'Snacks',
    icon: Cookie,
    color: 'text-amber-400',
  },
  {
    type: 'OTHER',
    label: 'Other',
    icon: Utensils,
    color: 'text-zinc-400',
  },
] as const;
