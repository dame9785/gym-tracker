import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

type ProductFiltersProps = {
  search?: string;
  category?: string;
  quality?: string;
  archived?: boolean;
  categories: string[];
};

export default function ProductFilters({ search = '', category = '', quality = '', archived = false, categories }: ProductFiltersProps) {
  const buttonClasses = 'flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors';

  return (
    <form action="/admin/products" method="GET" className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1">
        <FormField htmlFor="search" label="Search products">
          <FormInput id="search" name="search" type="search" defaultValue={search} placeholder="Name, brand or barcode..." />
        </FormField>
      </div>

      <div className="w-full sm:w-40">
        <FormField htmlFor="category" label="Category">
          <FormSelect id="category" name="category" defaultValue={category}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      <div className="w-full sm:w-40">
        <FormField htmlFor="quality" label="Data quality">
          <FormSelect id="quality" name="quality" defaultValue={quality}>
            <option value="">All quality levels</option>
            <option value="VERIFIED">Verified</option>
            <option value="STANDARD">Standard</option>
            <option value="UNVERIFIED">Unverified</option>
          </FormSelect>
        </FormField>
      </div>

      <div className="w-full sm:w-36">
        <FormField htmlFor="archived" label="Product status">
          <FormSelect id="archived" name="archived" defaultValue={archived ? 'true' : 'false'}>
            <option value="false">Active</option>
            <option value="true">Archived</option>
          </FormSelect>
        </FormField>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="md" className={buttonClasses}>
          Apply filters
        </Button>
        <a href="/admin/products" className={`${buttonClasses} border-border text-text-secondary hover:bg-surface-hover border`}>
          Reset
        </a>
      </div>
    </form>
  );
}
