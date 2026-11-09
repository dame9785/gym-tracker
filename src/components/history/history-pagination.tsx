import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function HistoryPagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const linkClass = 'flex h-10 min-w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm font-medium text-zinc-400 transition hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-400';

  return (
    <nav aria-label="Workout history pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={`/history?page=${currentPage - 1}`} scroll={false} className={`${linkClass} gap-1 px-3`}>
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
      )}

      {pages.map((page, index) => (
        <div key={page} className="flex items-center gap-2">
          {index > 0 && pages[index - 1] !== page - 1 && <span className="px-1 text-zinc-600">...</span>}

          {page === currentPage ? (
            <span aria-current="page" className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500 px-3 text-sm font-bold text-white shadow-lg shadow-orange-500/10">
              {page}
            </span>
          ) : (
            <Link href={`/history?page=${page}`} scroll={false} className={linkClass}>
              {page}
            </Link>
          )}
        </div>
      ))}

      {currentPage < totalPages && (
        <Link href={`/history?page=${currentPage + 1}`} scroll={false} className={`${linkClass} gap-1 px-3`}>
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
