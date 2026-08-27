import CreateFoodForm from '@/components/forms/food/create-food-form';

export default function AddFoodPage() {
  return (
    <main>
      <header>
        <h1>Add food</h1>
        <p>Add nutritional values per 100 grams.</p>
      </header>

      <CreateFoodForm />
    </main>
  );
}
