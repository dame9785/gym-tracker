'use client';

import FormStyles from '@/components/forms/form.module.css';
import { UpdateWeightDto, updateWeightSchema } from '@/schemas/weight-log.schemas';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/button/button';
import ButtonStyle from '@/components/button/button.module.css';
import Link from 'next/link';
import { LogItemViewModel } from '@/types/log-weight-types';
import { ErrorsHelper } from '@/helpers/error-helper';
import { updateLogWeightAction } from '@/actions/log-weight-actions';

import { toast } from 'sonner';

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
      console.error('Failed to update exercise:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Update
        <span> Weight</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="weight">
            Weight
          </label>
          <input
            onChange={handleChange}
            className={FormStyles.formInput}
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            placeholder="T.ex. 50"
          />
          {errors.weight && <p className={FormStyles.fieldErrorMessage}>{errors.weight}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="note">
            Note
          </label>
          <textarea
            className={FormStyles.formInput}
            id="note"
            name="note"
            value={formData.note}
            placeholder="Example. morning"
            onChange={handleChange}
          ></textarea>
          {errors.note && <p className={FormStyles.fieldErrorMessage}>{errors.note}</p>}
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
