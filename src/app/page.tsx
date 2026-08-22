import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Home</h1>
    </div>
  );
}
