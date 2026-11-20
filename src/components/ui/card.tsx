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
    interactive: 'transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04]',
  };

  return (
    <div className={`group border-border from-surface via-surface to-background relative min-w-0 overflow-hidden rounded-2xl border bg-linear-to-br shadow-sm ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`} {...props}>
      {/* Subtle top accent */}
      {accent && <div aria-hidden="true" className="via-primary/50 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />}

      {children}
    </div>
  );
}
