import FoodsService from '@/services/food-service';
import FoodList from '@/components/foods/food-list';
import Link from 'next/link';

export default async function FoodPage() {
  const response = await FoodsService.getAllFoods();

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
