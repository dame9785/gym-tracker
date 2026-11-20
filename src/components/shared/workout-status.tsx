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
    badgeClassName: 'bg-primary/10 text-primary',
    borderClassName: 'border-primary/50',
    icon: <Circle className="fill-primary text-primary h-3.5 w-3.5" />,
  },

  COMPLETED: {
    label: 'Completed',
    badgeClassName: 'bg-success/15 text-success',
    borderClassName: 'border-success/40',
    icon: <Check className="text-success h-3.5 w-3.5" />,
  },

  NOTCOMPLETED: {
    label: 'Missed',
    badgeClassName: 'bg-danger/10 text-danger',
    borderClassName: 'border-danger/50',
    icon: <X className="text-danger h-3.5 w-3.5" />,
  },
};
