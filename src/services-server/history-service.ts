import { mapToHistoryViewModel } from '@/mapping/history-mapping';
import { HistoryRepository } from '@/repositories/history-repository';

export class HistoryService {
  private historyRepository = new HistoryRepository();

  async getHistory() {
    try {
      const sessions = await this.historyRepository.getCompletedWorkoutSessions();

      const summary = await this.historyRepository.getWorkoutSummary();

      const history = sessions.map(mapToHistoryViewModel);

      return {
        success: true,
        history,
        summary,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Could not load workout history.',
      };
    }
  }
}
