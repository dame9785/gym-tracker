export class WorkoutSessionService {
  async getById(id: number) {
    const response = await fetch(`/api/workout-sessions/${id}`);

    return await response.json();
  }

  async create(workoutId: number) {
    const response = await fetch('/api/workout-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workoutId,
      }),
    });

    const result = await response.json();
    return result;
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
}
