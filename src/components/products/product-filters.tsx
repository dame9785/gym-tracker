type ProductFiltersProps = {
  search?: string;
  category?: string;
  quality?: string;
  archived?: boolean;
  categories: string[];
};

export default function ProductFilters({ search = '', category = '', quality = '', archived = false, categories }: ProductFiltersProps) {
  const inputClasses = 'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary';

  const labelClasses = 'mb-2 block text-xs font-medium text-text-muted';

  const buttonClasses = 'flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors';

  return (
    <form action="/admin/products" method="GET" className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:flex-wrap sm:items-end">
      {/* Search */}
      <div className="min-w-0 flex-1">
        <label htmlFor="search" className={labelClasses}>
          Search products
        </label>

        <input id="search" name="search" type="search" defaultValue={search} placeholder="Name, brand or barcode..." className={inputClasses} />
      </div>

      {/* Category */}
      <div className="w-full sm:w-40">
        <label htmlFor="category" className={labelClasses}>
          Category
        </label>

        <select id="category" name="category" defaultValue={category} className={inputClasses}>
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Data quality */}
      <div className="w-full sm:w-40">
        <label htmlFor="quality" className={labelClasses}>
          Data quality
        </label>

        <select id="quality" name="quality" defaultValue={quality} className={inputClasses}>
          <option value="">All quality levels</option>
          <option value="VERIFIED">Verified</option>
          <option value="STANDARD">Standard</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>
      </div>

      {/* Product status */}
      <div className="w-full sm:w-36">
        <label htmlFor="archived" className={labelClasses}>
          Product status
        </label>

        <select id="archived" name="archived" defaultValue={archived ? 'true' : 'false'} className={inputClasses}>
          <option value="false">Active</option>
          <option value="true">Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button type="submit" className={`${buttonClasses} bg-primary text-primary-foreground hover:bg-primary-hover`}>
          Apply filters
        </button>

        <a href="/admin/products" className={`${buttonClasses} border-border text-text-secondary hover:bg-surface-hover border`}>
          Reset
        </a>
      </div>
    </form>
  );
}
