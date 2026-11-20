import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { formControlClass } from './form-control-class';

type FormInputProps = ComponentPropsWithoutRef<'input'>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput({ className, ...props }, ref) {
  return <input ref={ref} {...props} className={`${formControlClass} ${className ?? ''}`.trim()} />;
});

FormInput.displayName = 'FormInput';

export default FormInput;
