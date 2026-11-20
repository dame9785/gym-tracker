import { notFound } from 'next/navigation';

import { ProductService } from '@/services/product-service';
import ProductForm from '@/components/forms/products/product-form';

const productService = new ProductService();

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await productService.getById(productId);

  if (!product) {
    notFound();
  }

  const productData = {
    ...product,
    calories: Number(product.calories),
    protein: Number(product.protein),
    carbs: Number(product.carbs),
    fat: Number(product.fat),
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-primary text-sm font-medium">PRODUCT CATALOGUE</p>

        <h1 className="text-text mt-2 text-3xl font-bold">Edit product</h1>

        <p className="text-text-muted mt-2 text-sm">Update product information and nutritional values.</p>
      </header>

      <ProductForm product={productData} />
    </div>
  );
}
