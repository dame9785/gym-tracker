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
      return {
        success: false,
        message: 'Något gick fel.',
      };
    }
  }
}
