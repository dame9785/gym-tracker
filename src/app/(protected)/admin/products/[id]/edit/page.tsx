import { notFound } from 'next/navigation';
import { ProductService } from '@/services/product-service';
import ProductForm from '@/components/products/product-form';

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
        <p className="text-sm font-medium text-orange-400">PRODUCT CATALOGUE</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Edit product</h1>
        <p className="mt-2 text-sm text-gray-400">Update product information and nutritional values.</p>
      </header>

      <ProductForm product={productData} />
    </div>
  );
}
