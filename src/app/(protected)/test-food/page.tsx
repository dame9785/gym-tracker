import { searchFoodsAction } from '@/actions/food-actions';

export default async function TestFoodPage() {
  const result = await searchFoodsAction('havregryn');

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Food API Test</h1>

      {!result.success || !result.data ? (
        <p className="text-red-500">{result.message ?? 'Kunde inte hämta livsmedel.'}</p>
      ) : (
        <>
          <h2 className="mb-2 text-lg font-semibold">Lokala livsmedel</h2>

          <pre className="mb-6 overflow-auto rounded-lg bg-gray-100 p-4 text-sm text-black">{JSON.stringify(result.data.localFoods, null, 2)}</pre>

          <h2 className="mb-2 text-lg font-semibold">Externa livsmedel</h2>

          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm text-black">{JSON.stringify(result.data.externalFoods, null, 2)}</pre>

          {result.data.externalSearchFailed && <p className="mt-4 text-red-500">External food search failed.</p>}
        </>
      )}
    </main>
  );
}
