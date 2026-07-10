export interface GoalType {
  id: number;
  title: string;
}

export async function getGoals(): Promise<GoalType[]> {
  const response = await fetch('/api/goals');

  if (!response.ok) {
    throw new Error('Kunde inte hämta mål.');
  }

  return response.json();
}
