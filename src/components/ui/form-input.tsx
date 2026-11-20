import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { formControlClass } from './form-control-class';

type FormInputProps = ComponentPropsWithoutRef<'input'>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput({ className, ...props }, ref) {
  if (props.type === 'date') {
    const invalid = props['aria-invalid'];

    return (
      <div
        className={`flex w-full min-w-0 max-w-full items-center overflow-hidden rounded-xl border bg-background/70 px-4 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${props.disabled ? 'cursor-not-allowed opacity-50' : ''} ${invalid ? 'border-danger' : 'border-border'}`}
      >
        <input
          ref={ref}
          {...props}
          className={`block w-full min-w-0 max-w-full flex-1 border-0 bg-transparent p-0 text-sm leading-normal text-text outline-none focus:ring-0 disabled:cursor-not-allowed ${className ?? ''}`.trim()}
        />
      </div>
    );
  }

  return <input ref={ref} {...props} className={`${formControlClass} ${className ?? ''}`.trim()} />;
});

FormInput.displayName = 'FormInput';

export default FormInput;
