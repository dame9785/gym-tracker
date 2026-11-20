import ProductForm from '@/components/forms/products/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-primary text-sm font-medium">PRODUCT CATALOGUE</p>

        <h1 className="text-text mt-2 text-3xl font-bold">Add product</h1>

        <p className="text-text-muted mt-2 text-sm">Add a new product to the GymTracker catalogue.</p>
      </header>

      <ProductForm />
    </div>
  );
}
