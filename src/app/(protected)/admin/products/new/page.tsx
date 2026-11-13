import ProductForm from '@/components/products/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-orange-400">PRODUCT CATALOGUE</p>

        <h1 className="mt-2 text-3xl font-bold text-white">Add product</h1>

        <p className="mt-2 text-sm text-gray-400">Add a new product to the GymTracker catalogue.</p>
      </header>

      <ProductForm />
    </div>
  );
}
