import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';

import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  id?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  ariaPressed?: boolean;
  role?: string;
  ariaSelected?: boolean;
  ariaControls?: string;
  tabIndex?: number;
  ariaExpanded?: boolean;
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, href, className = '', type = 'button', onClick, ariaLabel, ariaPressed, role, ariaSelected, ariaControls, tabIndex, id, ariaExpanded }: Props) {
  const isDisabled = disabled || loading;

  const buttonClassName = [styles.button, styles[variant], styles[size], isDisabled ? styles.disabled : '', className].filter(Boolean).join(' ');

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className="inline-flex items-center justify-center gap-2">{children}</span>
    </>
  );

  // Navigation
  if (href) {
    if (isDisabled) {
      return (
        <span className={buttonClassName} aria-disabled="true" aria-label={ariaLabel}>
          {content}
        </span>
      );
    }

    return (
      <Link href={href} className={buttonClassName} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  // Regular button
  return (
    <button aria-expanded={ariaExpanded} type={type} id={id} role={role} aria-selected={ariaSelected} aria-controls={ariaControls} tabIndex={tabIndex} className={buttonClassName} disabled={isDisabled} aria-busy={loading} aria-pressed={ariaPressed} aria-label={ariaLabel} onClick={onClick}>
      {content}
    </button>
  );
}
