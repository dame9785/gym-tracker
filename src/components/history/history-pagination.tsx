import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function HistoryPagination({ currentPage, totalPages }: Props) {
  console.log('Current Page', currentPage);
  console.log('totalPages', totalPages);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/*Left arrow */}
      {currentPage > 1 && (
        <Link href={`/history?page=${currentPage - 1}`} scroll={false} className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      )}
      {/*First Page*/}
      {currentPage > 1 && (
        <Link href={`/history?page=${1}`} scroll={false} className="lex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:text-white">
          1
        </Link>
      )}
      {/*Current Page*/}
      <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">{currentPage}</button>
      {/*Number Current Page + 1*/}
      {currentPage + 1 <= totalPages && (
        <Link scroll={false} className="lex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:text-white" href={`/history?page${currentPage + 2}`}>
          {currentPage + 1}
        </Link>
      )}
      {/*Number Current Page + 2*/}
      {currentPage + 2 <= totalPages && (
        <Link scroll={false} className="lex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:text-white" href={`/history?page${currentPage + 2}`}>
          {currentPage + 2}
        </Link>
      )}

      {/*Right arrow */}
      {currentPage < totalPages && (
        <Link scroll={false} href={`/history?page=${currentPage + 1}`} className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:text-white">
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
