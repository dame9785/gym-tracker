import { Check, Circle, X } from 'lucide-react';

import { WorkoutSessionStatus } from '@prisma/client';

import type { ReactNode } from 'react';

// --------------------------------------------------
// Status configuration
// --------------------------------------------------

type WorkoutStatusConfig = {
  label: string;
  badgeClassName: string;
  borderClassName: string;
  icon: ReactNode;
};

export const WORKOUT_STATUS_CONFIG: Record<WorkoutSessionStatus, WorkoutStatusConfig> = {
  ACTIVE: {
    label: 'Active',
    badgeClassName: 'bg-orange-500/10 text-orange-400',
    borderClassName: 'border-orange-500/50',
    icon: <Circle className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />,
  },

  COMPLETED: {
    label: 'Completed',
    badgeClassName: 'bg-emerald-500/15 text-emerald-300',
    borderClassName: 'border-emerald-500/40',
    icon: <Check className="h-3.5 w-3.5 text-emerald-400" />,
  },

  NOTCOMPLETED: {
    label: 'Missed',
    badgeClassName: 'bg-red-500/10 text-red-400',
    borderClassName: 'border-red-500/50',
    icon: <X className="h-3.5 w-3.5 text-red-400" />,
  },
};

// --------------------------------------------------
// Status helpers
// --------------------------------------------------

export function getWorkoutStatusLabel(status: WorkoutSessionStatus): string {
  return WORKOUT_STATUS_CONFIG[status].label;
}
