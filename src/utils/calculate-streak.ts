import { WorkoutSessionStatus } from '@prisma/client';

type WorkoutSessionForStreak = {
  startedAt: Date;
  status: WorkoutSessionStatus;
};

export function calculateStreak(sessions: WorkoutSessionForStreak[]): number {
  const completedSessions = sessions.filter((session) => session.status === 'COMPLETED').sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return completedSessions.length;
}
