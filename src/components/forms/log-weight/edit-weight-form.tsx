'use client';

import { UserViewModel } from '@/types/user-types';
import FormStyles from '@/components/forms/form.module.css';
import { EditWeightDto, editWeightSchema } from '@/schemas/weight-log.schemas';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/button/button';
import ButtonStyle from '@/components/button/button.module.css';
import Link from 'next/link';
import { LogItemViewModel } from '@/types/log-weight-types';
import { ErrorsHelper } from '@/helpers/error-helper';
import { LogWeightService } from '@/services/log-weight-service';
import { toast } from 'sonner';

type Props = {
  user: UserViewModel;
  logWeight: LogItemViewModel;
};

export default function EditWeightForm({ user, logWeight }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EditWeightDto, string>>>({});

  const [formData, setFormData] = useState<EditWeightDto>({
    weight: Number(logWeight.weight),
    note: logWeight.note ?? '',
  });

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = editWeightSchema.safeParse(formData);
    console.log(validation);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<EditWeightDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      const result = await LogWeightService.update(logWeight.id.toString(), validation.data);
      console.log(result);
      if (!result.success) {
        if (result.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<EditWeightDto>(result.errors));
        }
        toast.error('Något gick fel, vikt blev inte loggad');
        return;
      }
      toast.success('Vikt loggad');
      router.push('/log-weight');
    } catch (error) {
      toast.error('Något gick fel, vikt blev inte loggad');
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
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Ändra
        <span> Vikt</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="weight">
            Vikt
          </label>
          <input
            className={FormStyles.formInput}
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            placeholder="T.ex. 50"
            onChange={handleChange}
          ></input>
          {errors.weight && <p className={FormStyles.fieldErrorMessage}>{errors.weight}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="note">
            Notering
          </label>
          <textarea
            className={FormStyles.formInput}
            id="note"
            name="note"
            value={formData.note}
            placeholder="T.ex. morgonen"
            onChange={handleChange}
          ></textarea>
          {errors.note && <p className={FormStyles.fieldErrorMessage}>{errors.note}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            Uppdatera vikt
          </Button>
          <Link href="/log-weight" className={`${ButtonStyle.button} ${ButtonStyle.secondary}`}>
            Gå tillbaks
          </Link>
        </div>
      </form>
    </div>
  );
}
