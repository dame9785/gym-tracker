import { WorkoutSessionStatus } from '@prisma/client';

type WorkoutSessionForStreak = {
  startedAt: Date;
  status: WorkoutSessionStatus;
};

export function calculateStreak(sessions: WorkoutSessionForStreak[]): number {
  if (sessions.length === 0) {
    return 0;
  }

  // Sortera alla pass från senaste till äldsta.
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  let streak = 0;

  for (const session of sortedSessions) {
    // Ett ej genomfört pass bryter streaken.
    if (session.status !== 'COMPLETED') {
      break;
    }

    streak++;
  }

  return streak;
}
