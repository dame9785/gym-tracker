'use client';

import { useAuth } from '@/provider/auth-provider';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Laddar...</h1>;

  if (!user) return <h1>Ingen användare</h1>;

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Hej {user.username}</h2>
    </>
  );
}
