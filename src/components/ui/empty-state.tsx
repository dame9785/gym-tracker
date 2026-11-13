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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-14 text-center sm:py-16">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      )}

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">{description}</p>

      {action &&
        ('href' in action && action.href ? (
          <Link href={action.href} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={'onClick' in action ? action.onClick : undefined} className="mt-5 min-h-11 cursor-pointer rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
            {action.label}
          </button>
        ))}
    </div>
  );
}
