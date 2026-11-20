import type { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import ProductRowActions from './product-row-actions';

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
      <div className="border-border bg-surface rounded-2xl border px-6 py-16 text-center">
        <p className="text-text font-medium">No products found</p>
        <p className="text-text-muted mt-2 text-sm">There are currently no products in the catalogue.</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-text font-semibold">All products</h2>
          <p className="text-text-muted mt-1 text-sm">Manage your nutritional product catalogue</p>
        </div>

        <span className="bg-surface-secondary text-text-secondary rounded-lg px-3 py-1.5 text-sm font-medium">{products.length} products</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-surface-secondary text-text-muted text-xs tracking-wider uppercase">
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

          <tbody className="divide-border divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface-hover transition-colors">
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="text-text font-medium">{product.name}</div>

                  <div className="text-text-muted mt-1 text-xs">{product.brand || 'No brand'}</div>
                </td>

                {/* Category */}
                <td className="text-text-secondary px-4 py-4">{product.category || 'Uncategorized'}</td>

                {/* Calories */}
                <td className="text-text-secondary px-4 py-4 text-right tabular-nums">
                  {Number(product.calories).toFixed(0)}
                  <span className="text-text-muted ml-1 text-xs">kcal</span>
                </td>

                {/* Protein */}
                <td className="text-text-secondary px-4 py-4 text-right tabular-nums">{Number(product.protein).toFixed(1)} g</td>

                {/* Carbs */}
                <td className="text-text-secondary px-4 py-4 text-right tabular-nums">{Number(product.carbs).toFixed(1)} g</td>

                {/* Fat */}
                <td className="text-text-secondary px-4 py-4 text-right tabular-nums">{Number(product.fat).toFixed(1)} g</td>

                {/* Image */}
                <td className="px-5 py-3">
                  {product.imageUrl ? (
                    <div className="border-border bg-surface-secondary relative h-12 w-12 overflow-hidden rounded-lg border">
                      <Image src={product.imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="border-border bg-surface-secondary flex h-12 w-12 items-center justify-center rounded-lg border">
                      <span className="text-text-muted text-xl">🍽️</span>
                    </div>
                  )}
                </td>

                {/* Data quality */}
                <td className="px-5 py-4 text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${qualityStyles[product.dataQuality]}`}>{qualityLabels[product.dataQuality]}</span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="border-border text-text-secondary hover:border-primary/40 hover:bg-primary/10 hover:text-primary inline-flex h-9 w-24 items-center justify-center rounded-lg border text-xs font-medium transition-colors">
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

      {/* Footer */}
      <div className="border-border text-text-muted border-t px-5 py-3 text-xs">Nutritional values are displayed per 100 g.</div>
    </div>
  );
}
