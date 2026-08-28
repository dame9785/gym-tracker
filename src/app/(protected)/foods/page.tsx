import FoodsService from '@/services/food-service';
import FoodList from '@/components/foods/food-list';
import Link from 'next/link';

const foodService = new FoodsService();
export default async function FoodPage() {
  const response = await foodService.getAllFoods();

  if (!response.success) {
    throw new Error(response.message ?? 'Failed to fetch foods');
  }

  return (
    <main>
      <header>
        <h1>Foods</h1>

        <Link href="/foods/add">Add food</Link>
      </header>

      <FoodList foods={response.data.foods} />
    </main>
  );
}
