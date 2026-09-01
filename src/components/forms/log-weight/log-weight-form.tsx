'use client';

//Next Link & Hooks
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

//Alert
import { toast } from 'sonner';

//CSS Modules
import buttonStyles from '@/components/button/button.module.css';
import FormStyles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';

// Schemas
import { AddWeightDto, addWeightSchema } from '@/schemas/weight-log.schemas';

//Helpers
import { ErrorsHelper } from '@/helpers/error-helper';

import { CreateWeightLogAction } from '@/actions/log-weight-actions';

export default function LogWeightForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddWeightDto, string>>>({});
  const [formData, setFormData] = useState<AddWeightDto>({
    weight: 0,
    note: '',
  });

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

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const LogWeightDto = {
      weight: Number(formData.weight),
      note: formData.note,
    };

    const validation = addWeightSchema.safeParse(LogWeightDto);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<AddWeightDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      const response = await CreateWeightLogAction(validation.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<AddWeightDto>(response.errors));
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

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Lägg till
        <span> Vikt</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="weight">
            Vikt
          </label>
          <input className={FormStyles.formInput} id="weight" name="weight" type="number" step="0.1" placeholder="T.ex. 50" onChange={handleChange}></input>
          {errors.weight && <p className={FormStyles.fieldErrorMessage}>{errors.weight}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="note">
            Notering
          </label>
          <textarea className={FormStyles.formInput} id="note" name="note" placeholder="T.ex. morgonen" onChange={handleChange}></textarea>
          {errors.note && <p className={FormStyles.fieldErrorMessage}>{errors.note}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            Logga vikt
          </Button>
          <Link href="/log-weight" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
            Gå tillbaks
          </Link>
        </div>
      </form>
    </div>
  );
}
