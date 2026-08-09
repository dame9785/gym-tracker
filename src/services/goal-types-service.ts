//Next Redirect
import { redirect } from 'next/navigation';

//API URL
const API_URL = '/api/goals';

export class GoalTypesService {
  static async getAll() {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      const result = response.json();

      return;
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
