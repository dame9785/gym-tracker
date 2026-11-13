type ProductFiltersProps = {
  search?: string;
  category?: string;
  quality?: string;
  archived?: boolean;
  categories: string[];
};

export default function ProductFilters({ search = '', category = '', quality = '', archived = false, categories }: ProductFiltersProps) {
  return (
    <form action="/admin/products" method="GET" className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111827]/70 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1">
        <label htmlFor="search" className="mb-2 block text-xs font-medium text-gray-400">
          Search products
        </label>
        <input id="search" name="search" type="search" defaultValue={search} placeholder="Name, brand or barcode..." className="h-10 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-400" />
      </div>

      <div className="w-full sm:w-40">
        <label htmlFor="category" className="mb-2 block text-xs font-medium text-gray-400">
          Category
        </label>
        <select id="category" name="category" defaultValue={category} className="h-10 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm text-white outline-none focus:border-orange-400">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label htmlFor="quality" className="mb-2 block text-xs font-medium text-gray-400">
          Data quality
        </label>
        <select id="quality" name="quality" defaultValue={quality} className="h-10 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm text-white outline-none focus:border-orange-400">
          <option value="">All quality levels</option>
          <option value="VERIFIED">Verified</option>
          <option value="STANDARD">Standard</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>
      </div>

      <div className="w-full sm:w-36">
        <label htmlFor="archived" className="mb-2 block text-xs font-medium text-gray-400">
          Product status
        </label>
        <select id="archived" name="archived" defaultValue={archived ? 'true' : 'false'} className="h-10 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm text-white outline-none focus:border-orange-400">
          <option value="false">Active</option>
          <option value="true">Archived</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="h-10 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
          Apply filters
        </button>

        <a href="/admin/products" className="flex h-10 items-center rounded-lg border border-white/10 px-4 text-sm text-gray-300 transition-colors hover:bg-white/5">
          Reset
        </a>
      </div>
    </form>
  );
}
