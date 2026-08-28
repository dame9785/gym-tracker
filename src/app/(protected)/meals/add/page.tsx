import FoodsService from '@/services/food-service';
import AddMealForm from '@/components/forms/meal/add-meal-form';

const foodsService = new FoodsService();

export default async function AddMealPage() {
  const response = await foodsService.getAllFoods();
  if (!response.success || !response.data) {
    return (
      <main>
        <p>Could not load foods.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Add food</h1>

      <AddMealForm foods={response.data.foods} />
    </main>
  );
}
