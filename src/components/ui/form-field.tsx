import type { ReactNode } from 'react';

type FormFieldProps = {
  label: ReactNode;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, required = false, error, hint, footer, children }: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="text-text-secondary mb-2 flex items-center gap-2 text-sm font-medium">
        {label}

        {required && (
          <span className="text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {(error || hint || footer) && (
        <div className="mt-1.5 flex justify-between gap-3">
          <div className="min-w-0">{error ? <p className="text-danger text-xs">{error}</p> : hint ? <p className="text-text-muted text-xs">{hint}</p> : null}</div>

          {footer && <div className="text-text-muted shrink-0 text-xs">{footer}</div>}
        </div>
      )}
    </div>
  );
}
