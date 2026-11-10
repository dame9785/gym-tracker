import FoodSearch from '@/components/foods/food-search';

export default function FoodPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Foods</h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">Search, import and manage foods in your personal food library.</p>
        </div>

        <FoodSearch />
      </div>
    </main>
  );
}
