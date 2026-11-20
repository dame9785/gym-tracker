import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accent?: boolean;
};

export default function Card({ children, className = '', variant = 'default', padding = 'md', accent = false, ...props }: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6 lg:p-7',
  };

  const variantStyles = {
    default: '',
    interactive: 'transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/[0.04]',
  };

  return (
    <div className={`group relative min-w-0 overflow-hidden rounded-2xl border border-zinc-800/80 bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-sm ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`} {...props}>
      {/* Subtle top accent */}
      {accent && <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />}

      {children}
    </div>
  );
}
