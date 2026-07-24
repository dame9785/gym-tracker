export class WorkoutSessionService {
  async getById(id: number) {
    const response = await fetch(`/api/workout-sessions/${id}`);

    return await response.json();
  }

  async create(workoutId: number) {
    const token = localStorage.getItem('token');

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
  }

  async updateSet(id: number, actualReps: number, actualWeight: number) {
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
  }

  async finish(id: number) {
    const token = localStorage.getItem('token');

    const response = await fetch(`/api/workout-sessions/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  }
}
