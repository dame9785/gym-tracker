//Next Redirect
import { redirect } from 'next/navigation';

export class WorkoutSessionService {
  //GET Session By Id
  async getById(id: number) {
    try {
      const response = await fetch(`/api/workout-sessions/${id}`);
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //POST: Create session
  async create(workoutId: number) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/workout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workoutId,
        }),
      });

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //PUT: Update session
  async updateSet(id: number, actualReps: number, actualWeight: number) {
    try {
      const response = await fetch(`/api/workout-session-sets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actualReps,
          actualWeight,
        }),
      });

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //PUT: Finish session
  async finish(id: number) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/workout-sessions/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
