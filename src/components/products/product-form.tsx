'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { createProductAction, updateProductAction } from '@/actions/product-actions';

type ProductFormData = {
  id: number;
  name: string;
  brand: string | null;
  barcode: string | null;
  category: string | null;
  imageUrl: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dataQuality: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED';
  nutritionSource: string | null;
};

type ProductFormProps = {
  product?: ProductFormData;
};

type FormValues = {
  name: string;
  brand: string;
  barcode: string;
  category: string;
  imageUrl: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  dataQuality: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED';
  nutritionSource: string;
};

const inputClass = 'w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-orange-400';

const labelClass = 'mb-2 block text-sm font-medium text-gray-300';

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [values, setValues] = useState<FormValues>({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    barcode: product?.barcode ?? '',
    category: product?.category ?? '',
    imageUrl: product?.imageUrl ?? '',
    calories: String(product?.calories ?? 0),
    protein: String(product?.protein ?? 0),
    carbs: String(product?.carbs ?? 0),
    fat: String(product?.fat ?? 0),
    dataQuality: product?.dataQuality ?? 'UNVERIFIED',
    nutritionSource: product?.nutritionSource ?? '',
  });

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const input = {
      ...values,
      calories: Number(values.calories),
      protein: Number(values.protein),
      carbs: Number(values.carbs),
      fat: Number(values.fat),
    };

    startTransition(async () => {
      const result = product ? await updateProductAction(product.id, input) : await createProductAction(input);

      if (!result.success) {
        setError(result.message || 'Something went wrong.');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product information */}
      <section className="rounded-2xl border border-white/10 bg-[#111827]/70 p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Product information</h2>
          <p className="mt-1 text-sm text-gray-500">Basic information about the product.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Product name *
            </label>
            <input id="name" required maxLength={191} value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="e.g. Kvarg naturell" className={inputClass} />
          </div>

          <div>
            <label htmlFor="brand" className={labelClass}>
              Brand
            </label>
            <input id="brand" maxLength={100} value={values.brand} onChange={(event) => updateField('brand', event.target.value)} placeholder="Brand name" className={inputClass} />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input id="category" maxLength={100} value={values.category} onChange={(event) => updateField('category', event.target.value)} placeholder="e.g. Mejeri" className={inputClass} />
          </div>

          <div>
            <label htmlFor="barcode" className={labelClass}>
              Barcode
            </label>
            <input id="barcode" maxLength={50} value={values.barcode} onChange={(event) => updateField('barcode', event.target.value)} placeholder="Product barcode" className={inputClass} />
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Image URL
            </label>
            <input id="imageUrl" type="url" value={values.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="https://..." className={inputClass} />
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="rounded-2xl border border-white/10 bg-[#111827]/70 p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Nutritional values</h2>
          <p className="mt-1 text-sm text-gray-500">Enter nutritional values per 100 grams.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="calories" className={labelClass}>
              Calories (kcal)
            </label>
            <input id="calories" type="number" min="0" max="10000" step="any" required value={values.calories} onChange={(event) => updateField('calories', event.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="protein" className={labelClass}>
              Protein (g)
            </label>
            <input id="protein" type="number" min="0" max="1000" step="any" required value={values.protein} onChange={(event) => updateField('protein', event.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="carbs" className={labelClass}>
              Carbs (g)
            </label>
            <input id="carbs" type="number" min="0" max="1000" step="any" required value={values.carbs} onChange={(event) => updateField('carbs', event.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="fat" className={labelClass}>
              Fat (g)
            </label>
            <input id="fat" type="number" min="0" max="1000" step="any" required value={values.fat} onChange={(event) => updateField('fat', event.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Data quality */}
      <section className="rounded-2xl border border-white/10 bg-[#111827]/70 p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Data quality</h2>
          <p className="mt-1 text-sm text-gray-500">Specify how the nutritional information was verified.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="dataQuality" className={labelClass}>
              Quality status *
            </label>
            <select id="dataQuality" value={values.dataQuality} onChange={(event) => updateField('dataQuality', event.target.value as FormValues['dataQuality'])} className={inputClass}>
              <option value="UNVERIFIED">Unverified</option>
              <option value="STANDARD">Standard</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>

          <div>
            <label htmlFor="nutritionSource" className={labelClass}>
              Nutrition source
            </label>
            <input id="nutritionSource" maxLength={255} value={values.nutritionSource} onChange={(event) => updateField('nutritionSource', event.target.value)} placeholder="e.g. Manufacturer website or packaging" className={inputClass} />
          </div>
        </div>

        {values.dataQuality === 'VERIFIED' && <p className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400">A nutrition source is required when a product is marked as verified.</p>}
      </section>

      {/* Error */}
      {error && (
        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" disabled={isPending} onClick={() => router.back()} className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50">
          Cancel
        </button>

        <button type="submit" disabled={isPending} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
          {isPending ? 'Saving...' : product ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
