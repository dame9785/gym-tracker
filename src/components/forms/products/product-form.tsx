'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Check, FileText, Image as ImageIcon, LoaderCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/button/button';
import ImageUpload from '@/components/ui/image-upload';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import { createProductAction, updateProductAction } from '@/actions/product-actions';

import { createProductSchema, updateProductSchema, type CreateProductDto } from '@/schemas/product-schema';

import { ErrorsHelper } from '@/helpers/error-helper';

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
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  dataQuality: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED';
  nutritionSource: string;
};

const sectionClass = 'min-w-0 w-full rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 sm:p-7';

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductDto, string>>>({});

  const [formData, setFormData] = useState<FormValues>({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    barcode: product?.barcode ?? '',
    category: product?.category ?? '',
    calories: String(product?.calories ?? 0),
    protein: String(product?.protein ?? 0),
    carbs: String(product?.carbs ?? 0),
    fat: String(product?.fat ?? 0),
    dataQuality: product?.dataQuality ?? 'UNVERIFIED',
    nutritionSource: product?.nutritionSource ?? '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    const input = {
      ...formData,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
      ...(removeImage ? { imageUrl: '' } : {}),
    };

    const validation = product ? updateProductSchema.safeParse(input) : createProductSchema.safeParse(input);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<CreateProductDto>(validation.error.issues));

      toast.error('Please check the highlighted fields.');
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = product ? await updateProductAction(product.id, validation.data, selectedImage, removeImage) : await createProductAction(validation.data, selectedImage);

      if (!response.success) {
        if (response.errors) {
          const definedErrors = Object.fromEntries(Object.entries(response.errors).filter((entry): entry is [string, string[]] => Array.isArray(entry[1])));

          setErrors(ErrorsHelper.getFormErrorsFromApi<CreateProductDto>(definedErrors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      router.replace('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl min-w-0 px-3 pt-5 pb-8 sm:px-6 sm:pt-8 sm:pb-12 lg:pt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product information */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Product information</h2>
              <p className="mt-1 text-xs text-zinc-500">Basic information about the product.</p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField htmlFor="name" label="Product name" required error={errors.name} hint="Enter the product name." footer={`${formData.name.length}/191`}>
              <FormInput id="name" name="name" type="text" placeholder="e.g. Kvarg naturell" value={formData.name} onChange={handleChange} required maxLength={191} disabled={isSaving} aria-invalid={!!errors.name} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField htmlFor="brand" label="Brand" error={errors.brand}>
                <FormInput id="brand" name="brand" type="text" placeholder="Brand name" value={formData.brand} onChange={handleChange} maxLength={100} disabled={isSaving} aria-invalid={!!errors.brand} />
              </FormField>

              <FormField htmlFor="category" label="Category" error={errors.category}>
                <FormInput id="category" name="category" type="text" placeholder="e.g. Dairy" value={formData.category} onChange={handleChange} maxLength={100} disabled={isSaving} aria-invalid={!!errors.category} />
              </FormField>

              <FormField htmlFor="barcode" label="Barcode" error={errors.barcode}>
                <FormInput id="barcode" name="barcode" type="text" placeholder="Product barcode" value={formData.barcode} onChange={handleChange} maxLength={50} disabled={isSaving} aria-invalid={!!errors.barcode} />
              </FormField>
            </div>
          </div>
        </section>

        {/* Nutritional values */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Nutritional values</h2>
              <p className="mt-1 text-xs text-zinc-500">Nutritional information per 100 grams.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <FormField htmlFor="calories" label="Calories (kcal)" required error={errors.calories}>
              <FormInput id="calories" name="calories" type="number" min="0" max="10000" step="any" required value={formData.calories} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.calories} />
            </FormField>

            <FormField htmlFor="protein" label="Protein (g)" required error={errors.protein}>
              <FormInput id="protein" name="protein" type="number" min="0" max="1000" step="any" required value={formData.protein} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.protein} />
            </FormField>

            <FormField htmlFor="carbs" label="Carbs (g)" required error={errors.carbs}>
              <FormInput id="carbs" name="carbs" type="number" min="0" max="1000" step="any" required value={formData.carbs} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.carbs} />
            </FormField>

            <FormField htmlFor="fat" label="Fat (g)" required error={errors.fat}>
              <FormInput id="fat" name="fat" type="number" min="0" max="1000" step="any" required value={formData.fat} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.fat} />
            </FormField>
          </div>
        </section>

        {/* Data quality */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Data quality</h2>
              <p className="mt-1 text-xs text-zinc-500">Specify how the nutritional information was verified.</p>
            </div>
          </div>

          <div className="space-y-5">
            <FormField htmlFor="dataQuality" label="Quality status" required>
              <FormSelect id="dataQuality" name="dataQuality" value={formData.dataQuality} onChange={handleChange} disabled={isSaving}>
                <option value="UNVERIFIED">Unverified</option>
                <option value="STANDARD">Standard</option>
                <option value="VERIFIED">Verified</option>
              </FormSelect>
            </FormField>

            <FormField htmlFor="nutritionSource" label="Nutrition source" error={errors.nutritionSource} hint="Required when the product is marked as verified.">
              <FormInput id="nutritionSource" name="nutritionSource" type="text" placeholder="e.g. Manufacturer website or packaging" value={formData.nutritionSource} onChange={handleChange} maxLength={255} disabled={isSaving} aria-invalid={!!errors.nutritionSource} />
            </FormField>

            {formData.dataQuality === 'VERIFIED' && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400">A nutrition source is required when a product is marked as verified.</p>}
          </div>
        </section>

        {/* Product image */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ImageIcon className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Product image</h2>
              <p className="mt-1 text-xs text-zinc-500">Upload or replace the product image.</p>
            </div>
          </div>

          <ImageUpload
            file={selectedImage}
            onFileChange={(file) => {
              setSelectedImage(file);
              setRemoveImage(false);
            }}
            currentImageUrl={removeImage ? null : product?.imageUrl}
            currentImageAlt={`Image of ${product?.name ?? 'product'}`}
            disabled={isSaving}
          />

          <p className="mt-3 text-xs leading-5 text-zinc-500">Optional. JPG, PNG or WebP, maximum 5 MB.</p>

          {product?.imageUrl && !removeImage && (
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setRemoveImage(true);
              }}
              disabled={isSaving}
              className="mt-3 text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
            >
              Remove current image
            </button>
          )}

          {removeImage && (
            <button type="button" onClick={() => setRemoveImage(false)} disabled={isSaving} className="mt-3 text-sm text-zinc-400 transition hover:text-white">
              Keep current image
            </button>
          )}
        </section>

        {/* Form actions */}
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-xl sm:flex-row sm:justify-end">
          <Link href="/admin/products" aria-disabled={isSaving} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>

          <Button type="submit" variant="primary" disabled={isSaving}>
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {product ? 'Save changes' : 'Create product'}
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
