import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  ariaLabel?: string;
};

export default function Pagination({ currentPage, totalPages, basePath, ariaLabel = 'Pagination' }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const linkClass = 'flex h-10 min-w-10 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-muted transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary';

  const getPageUrl = (page: number) => `${basePath}${basePath.includes('?') ? '&' : '?'}page=${page}`;

  return (
    <nav aria-label={ariaLabel} className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} scroll={false} className={`${linkClass} gap-1 px-3`}>
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
      )}

      {pages.map((page, index) => (
        <div key={page} className="flex items-center gap-2">
          {index > 0 && pages[index - 1] !== page - 1 && (
            <span aria-hidden="true" className="text-text-muted px-1">
              ...
            </span>
          )}

          {page === currentPage ? (
            <span aria-current="page" className="border-primary/30 bg-primary text-primary-foreground shadow-primary/10 flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold shadow-lg">
              {page}
            </span>
          ) : (
            <Link href={getPageUrl(page)} scroll={false} className={linkClass}>
              {page}
            </Link>
          )}
        </div>
      ))}

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} scroll={false} className={`${linkClass} gap-1 px-3`}>
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
