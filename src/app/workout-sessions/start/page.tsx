import { redirect } from 'next/navigation';

export default async function StartWorkoutPage() {
  // Här ska vi senare skapa WorkoutSession

  redirect('/dashboard');
}
