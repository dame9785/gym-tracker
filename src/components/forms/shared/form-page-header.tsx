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
        <Link href={backHref} aria-label={backLabel} className="border-border bg-surface text-text-secondary hover:border-primary/50 hover:text-primary mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}

      <div>
        <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>

        <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">
          {title} <span className="text-primary">{highlightedTitle}</span>
        </h1>

        <p className="text-text-muted mt-2 max-w-xl text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}
