//Repository
import { HistoryRepository } from '@/repositories/history-repository';

//Types
import { HistoryMapper } from '@/mapping/history-mapping';

export class HistoryService {
  private historyRepository = new HistoryRepository();

  async getHistory() {
    try {
      const sessions = await this.historyRepository.getCompletedWorkoutSessions();

      const summary = await this.historyRepository.getWorkoutSummary();

      const history = sessions.map((s) => HistoryMapper.mapHistoryDtoToViewModel(s));

      return {
        success: true,
        history,
        summary,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Could not load workout history.',
      };
    }
  }
}
