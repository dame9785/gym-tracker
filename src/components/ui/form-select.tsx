import type { ComponentPropsWithoutRef } from 'react';
import { formControlClass } from './form-control-class';

type FormSelectProps = ComponentPropsWithoutRef<'select'>;

export default function FormSelect({ className, ...props }: FormSelectProps) {
  return <select {...props} className={`${formControlClass} ${className ?? ''}`.trim()} />;
}
