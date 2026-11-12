'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import FormStyles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';
import ButtonStyle from '@/components/button/button.module.css';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormTextarea from '@/components/ui/form-textarea';

import { UpdateWeightDto, updateWeightSchema } from '@/schemas/weight-log.schemas';
import { LogItemViewModel } from '@/types/log-weight-types';
import { ErrorsHelper } from '@/helpers/error-helper';
import { updateLogWeightAction } from '@/actions/log-weight-actions';

type Props = {
  logWeight: LogItemViewModel;
};

export default function EditWeightForm({ logWeight }: Props) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateWeightDto, string>>>({});

  const [formData, setFormData] = useState<UpdateWeightDto>({
    weight: Number(logWeight.weight),
    note: logWeight.note ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weight' ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = updateWeightSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateWeightDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateLogWeightAction(logWeight.id, validation.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<UpdateWeightDto>(response.errors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/log-weight');
    } catch (error) {
      console.error('Failed to update weight log:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Update
        <span> Weight</span>
      </h1>

      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor="weight" label="Weight" error={errors.weight}>
            <FormInput id="weight" name="weight" type="number" step="0.1" value={formData.weight} placeholder="T.ex. 50" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.weight} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor="note" label="Note" error={errors.note}>
            <FormTextarea id="note" name="note" value={formData.note ?? ''} placeholder="Example. morning" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.note} />
          </FormField>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Update weight'}
          </Button>

          <Link href="/log-weight" className={`${ButtonStyle.button} ${ButtonStyle.secondary}`}>
            Gå tillbaks
          </Link>
        </div>
      </form>
    </div>
  );
}
