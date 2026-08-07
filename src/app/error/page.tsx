type Props = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function ErrorPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900">
      <div>
        <h1>Något gick fel</h1>
        <p>{message ?? 'Okänt fel'}</p>
      </div>
    </main>
  );
}
