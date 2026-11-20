import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Action =
  | {
      label: string;
      href: string;
      onClick?: never;
    }
  | {
      label: string;
      onClick: () => void;
      href?: never;
    };

type Props = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: Action;
};

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="border-border bg-surface/40 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center sm:py-16">
      {Icon && (
        <div className="bg-surface-secondary flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon className="text-info h-6 w-6" />
        </div>
      )}

      <h3 className="text-text mt-4 text-base font-semibold">{title}</h3>

      <p className="text-text-muted mt-2 max-w-sm text-sm leading-6">{description}</p>

      {action &&
        ('href' in action && action.href ? (
          <Link href={action.href} className="bg-surface-secondary text-text hover:bg-surface-hover mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors">
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={'onClick' in action ? action.onClick : undefined} className="bg-surface-secondary text-text hover:bg-surface-hover mt-5 min-h-11 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium transition-colors">
            {action.label}
          </button>
        ))}
    </div>
  );
}
