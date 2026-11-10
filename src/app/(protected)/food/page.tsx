import FoodSearch from '@/components/foods/food-search';
import { requireAuth } from '@/lib/auth';
import { FoodService } from '@/services/food-service';

const foodService = new FoodService();

export default async function FoodPage(): Promise<React.ReactElement> {
  const user = await requireAuth();
  const [initialFoods, initialFeaturedFoods] = await Promise.all([foodService.getAllFoods(user.userId), foodService.getFeaturedFoods(user.userId)]);

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Foods</h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">Search, import and manage foods in your personal food library.</p>
        </div>

        <FoodSearch initialFoods={initialFoods} initialFeaturedFoods={initialFeaturedFoods} />
      </div>
    </main>
  );
}
