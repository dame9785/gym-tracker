import type { ComponentPropsWithoutRef } from 'react';
import { formControlClass } from './form-control-class';

type FormInputProps = ComponentPropsWithoutRef<'input'>;

export default function FormInput({ className, ...props }: FormInputProps) {
  return <input {...props} className={`${formControlClass} ${className ?? ''}`.trim()} />;
}
