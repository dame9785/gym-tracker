import type { ComponentPropsWithoutRef } from 'react';
import { formControlClass } from './form-control-class';

type FormTextareaProps = ComponentPropsWithoutRef<'textarea'>;

export default function FormTextarea({ className, ...props }: FormTextareaProps) {
  return <textarea {...props} className={`${formControlClass} resize-y leading-6 ${className ?? ''}`.trim()} />;
}
