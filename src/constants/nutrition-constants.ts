import { Cookie, Sun, Sunrise, Sunset, Utensils } from 'lucide-react';

export const MEAL_SECTIONS = [
  {
    type: 'BREAKFAST',
    label: 'Breakfast',
    icon: Sunrise,
    color: 'text-primary',
  },
  {
    type: 'LUNCH',
    label: 'Lunch',
    icon: Sun,
    color: 'text-warning',
  },
  {
    type: 'DINNER',
    label: 'Dinner',
    icon: Sunset,
    color: 'text-info',
  },
  {
    type: 'SNACK',
    label: 'Snacks',
    icon: Cookie,
    color: 'text-danger',
  },
  {
    type: 'OTHER',
    label: 'Other',
    icon: Utensils,
    color: 'text-text-secondary',
  },
] as const;
