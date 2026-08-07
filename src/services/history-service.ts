//Next Redirect
import { redirect } from 'next/navigation';

export default class HistoryService {
  static async getHistory() {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      return {
        success: true,
        history: data.history,
        summary: data.summary,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
