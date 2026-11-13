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
      <label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200">
        {label}

        {required && (
          <span className="text-orange-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {(error || hint || footer) && (
        <div className="mt-1.5 flex justify-between gap-3">
          <div className="min-w-0">{error ? <p className="text-xs text-red-400">{error}</p> : hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}</div>

          {footer && <div className="shrink-0 text-xs text-zinc-500">{footer}</div>}
        </div>
      )}
    </div>
  );
}
