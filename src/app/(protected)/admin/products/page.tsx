import Link from 'next/link';

import { ProductService } from '@/services/product-service';
import Pagination from '@/components/ui/pagination';

import ProductFilters from '@/components/products/product-filters';
import ProductTable from '@/components/products/product-table';

const productService = new ProductService();

const PAGE_SIZE = 10;

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    quality?: string;
    archived?: string;
    page?: string;
  }>;
};

const validQualities = ['VERIFIED', 'STANDARD', 'UNVERIFIED'] as const;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || '';
  const category = params.category || '';
  const archived = params.archived === 'true';

  const quality = validQualities.includes(params.quality as (typeof validQualities)[number]) ? (params.quality as (typeof validQualities)[number]) : undefined;

  const parsedPage = Number(params.page);
  const requestedPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [allProducts, result] = await Promise.all([productService.getAll(undefined, undefined, undefined, archived), productService.getPaginated(search, category, quality, archived, requestedPage, PAGE_SIZE)]);

  const categories = [...new Set(allProducts.map((product) => product.category).filter((category): category is string => Boolean(category)))].sort();

  const currentPage = Math.min(requestedPage, Math.max(1, result.totalPages));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-orange-400">ADMINISTRATION</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Product catalogue</h1>

          <p className="mt-2 text-sm text-gray-400">Manage products and nutritional information in GymTracker.</p>
        </div>

        <Link href="/admin/products/new" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
          <span className="text-xl leading-none">+</span>
          Add product
        </Link>
      </header>

      <ProductFilters search={search} category={category} quality={quality} archived={archived} categories={categories} />

      <ProductTable products={result.products} archived={archived} />

      {result.totalProducts > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, result.totalProducts)} of {result.totalProducts} products
          </p>

          <Pagination currentPage={currentPage} totalPages={result.totalPages} basePath={`/admin/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&quality=${encodeURIComponent(quality ?? '')}&archived=${archived}`} ariaLabel="Product pagination" />
        </div>
      )}
    </div>
  );
}
