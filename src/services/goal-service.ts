//Next Redirect
import { redirect } from 'next/navigation';

export default class GoalService {
  static async getAll() {
    try {
      const response = await fetch('/api/goals', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Kunde inte hämta mål.');
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
