export default class GoalService {
  static async getAll() {
    const response = await fetch('/api/goals', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Kunde inte hämta mål.');
    }

    return await response.json();
  }
}
