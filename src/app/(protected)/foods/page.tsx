import FoodsService from '@/services/food-service';
import FoodList from '@/components/foods/food-list';
import Link from 'next/link';
import ErrorMessage from '@/components/ui/error-message';

const foodService = new FoodsService();

export default async function FoodPage() {
  const response = await foodService.getAllFoods();

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  return (
    <main>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Foods</h1>

          <p className="mt-1 text-sm text-zinc-400">Manage your food library and nutrition information.</p>
        </div>

        <Link
          href="/foods/add"
          className="flex w-fit items-center gap-2 rounded-lg border border-pink-500/30 bg-pink-500/10 px-4 py-2.5 text-sm font-medium text-pink-400 transition hover:border-pink-500/50 hover:bg-pink-500/20 hover:text-pink-300"
        >
          <span className="text-lg leading-none">+</span>
          Add food
        </Link>
      </header>

      <FoodList foods={response.data.foods} />
    </main>
  );
}
