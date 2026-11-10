import FoodSearch from '@/components/foods/food-search';
import Header from '@/components/ui/header';
import { requireAuth } from '@/lib/auth';
import { FoodService } from '@/services/food-service';

const foodService = new FoodService();

export default async function FoodPage(): Promise<React.ReactElement> {
  const user = await requireAuth();
  const [initialFoods, initialFeaturedFoods] = await Promise.all([foodService.getAllFoods(user.userId), foodService.getFeaturedFoods(user.userId)]);

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        <section className="min-w-0">
          <Header title="YOUR NUTRITION" subTitle="Food & Nutrition" description="Manage your food library, explore Swedish food data from Livsmedelsverket, and track calories, protein, carbohydrates, and fat to support your fitness goals." />
        </section>

        <FoodSearch initialFoods={initialFoods} initialFeaturedFoods={initialFeaturedFoods} />
      </div>
    </main>
  );
}
