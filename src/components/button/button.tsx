import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, href, className = '', type = 'button', onClick }: Props) {
  const isDisabled = disabled || loading;

  const buttonClassName = [styles.button, styles[variant], styles[size], isDisabled ? styles.disabled : '', className].filter(Boolean).join(' ');

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span>{children}</span>
    </>
  );

  // Navigation
  if (href) {
    if (isDisabled) {
      return (
        <span className={buttonClassName} aria-disabled="true">
          {content}
        </span>
      );
    }

    return (
      <Link href={href} className={buttonClassName}>
        {content}
      </Link>
    );
  }

  // Regular button
  return (
    <button type={type} className={buttonClassName} disabled={isDisabled} aria-busy={loading} onClick={onClick}>
      {content}
    </button>
  );
}
