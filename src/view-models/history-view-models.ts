export interface HistoryViewModel {
  id: number;
  workoutName: string;
  startedAt: string;
  finishedAt: string | null;
  durationInMinutes: number;
  exerciseCount: number;
}
