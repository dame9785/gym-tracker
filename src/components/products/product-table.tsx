import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import ProductRowActions from './product-row-actions';
import Image from 'next/image';

type Product = Prisma.ProductGetPayload<Record<string, never>>;

type ProductTableProps = {
  products: Product[];
  archived?: boolean;
};

const qualityStyles = {
  VERIFIED: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  STANDARD: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  UNVERIFIED: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
};

const qualityLabels = {
  VERIFIED: 'Verified',
  STANDARD: 'Standard',
  UNVERIFIED: 'Unverified',
};

export default function ProductTable({ products, archived = false }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <p className="font-medium text-white">No products found</p>
        <p className="mt-2 text-sm text-gray-500">There are currently no products in the catalogue.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/70">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-semibold text-white">All products</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your nutritional product catalogue</p>
        </div>

        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300">{products.length} products</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs tracking-wider text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-4 py-4 font-medium">Category</th>
              <th className="px-4 py-4 text-right font-medium">Calories</th>
              <th className="px-4 py-4 text-right font-medium">Protein</th>
              <th className="px-4 py-4 text-right font-medium">Carbs</th>
              <th className="px-4 py-4 text-right font-medium">Fat</th>
              <th className="w-20 px-5 py-4 font-medium">Image</th>
              <th className="px-5 py-4 text-right font-medium">Data quality</th>

              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06]">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-4">
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{product.brand || 'No brand'}</div>
                </td>

                <td className="px-4 py-4 text-gray-400">{product.category || 'Uncategorized'}</td>

                <td className="px-4 py-4 text-right text-gray-300 tabular-nums">
                  {Number(product.calories).toFixed(0)}
                  <span className="ml-1 text-xs text-gray-500">kcal</span>
                </td>

                <td className="px-4 py-4 text-right text-gray-300 tabular-nums">{Number(product.protein).toFixed(1)} g</td>

                <td className="px-4 py-4 text-right text-gray-300 tabular-nums">{Number(product.carbs).toFixed(1)} g</td>

                <td className="px-4 py-4 text-right text-gray-300 tabular-nums">{Number(product.fat).toFixed(1)} g</td>
                <td className="px-5 py-3">
                  {product.imageUrl ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <Image src={product.imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <span className="text-xl text-gray-500">🍽️</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${qualityStyles[product.dataQuality]}`}>{qualityLabels[product.dataQuality]}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="inline-flex h-9 w-24 items-center justify-center rounded-lg border border-white/10 text-xs font-medium text-gray-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-400">
                      Edit
                    </Link>

                    <ProductRowActions id={product.id} name={product.name} archived={archived} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-xs text-gray-500">Nutritional values are displayed per 100 g.</div>
    </div>
  );
}
