import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

type Props = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  icon: LucideIcon;
  showBackButton?: boolean;
};

export default function FormPageHeader({ backHref, backLabel, eyebrow, title, highlightedTitle, description, icon: Icon, showBackButton = true }: Props) {
  return (
    <div className="mb-8 flex items-start gap-4">
      {showBackButton && (
        <Link href={backHref} aria-label={backLabel} className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-400">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title} <span className="text-orange-400">{highlightedTitle}</span>
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
