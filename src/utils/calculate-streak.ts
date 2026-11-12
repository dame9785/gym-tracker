import { WorkoutSessionStatus } from '@prisma/client';

// --------------------------------------------------
// Types
// --------------------------------------------------

type WorkoutSessionForStreak = {
  startedAt: Date;
  status: WorkoutSessionStatus;
};

// --------------------------------------------------
// Calculate workout streak
// --------------------------------------------------

export function calculateStreak(sessions: WorkoutSessionForStreak[]): number {
  if (sessions.length === 0) {
    return 0;
  }

  const sortedSessions = [...sessions].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

  let streak = 0;

  for (const session of sortedSessions) {
    if (session.status !== 'COMPLETED') {
      break;
    }

    streak++;
  }

  return streak;
}
