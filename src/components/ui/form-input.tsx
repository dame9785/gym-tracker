import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { formControlClass } from './form-control-class';

type FormInputProps = ComponentPropsWithoutRef<'input'>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput({ className, type, ...props }, ref) {
  const dateClasses = type === 'date' ? 'min-w-0 max-w-full box-border' : '';

  return <input ref={ref} type={type} {...props} className={`${formControlClass} ${dateClasses} ${className ?? ''}`.trim()} />;
});

FormInput.displayName = 'FormInput';

export default FormInput;
