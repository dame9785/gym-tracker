'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import FormStyles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormTextarea from '@/components/ui/form-textarea';

import { AddWeightDto, addWeightSchema } from '@/schemas/weight-log.schemas';
import { ErrorsHelper } from '@/helpers/error-helper';
import { CreateWeightLogAction } from '@/actions/log-weight-actions';
import FormPageHeader from '@/components/forms/shared/form-page-header';
import { Scale } from 'lucide-react';

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
      [name]: name === 'weight' ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = addWeightSchema.safeParse({
      weight: formData.weight,
      note: formData.note,
    });

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
          setErrors(ErrorsHelper.getFormErrorsFromApi<AddWeightDto>(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined))));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/log-weight');
    } catch (error) {
      console.error('Failed to create weight log:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={FormStyles.formContainer}>
      <FormPageHeader backHref="/log-weight" backLabel="Back to weight tracking" eyebrow="Weight tracking" title="Track your" highlightedTitle="weight" description="Record your weight and keep track of your progress over time." icon={Scale} />

      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <div className={FormStyles.formGroup}>
          <FormField htmlFor="weight" label="Vikt" error={errors.weight}>
            <FormInput id="weight" name="weight" type="number" step="0.1" placeholder="T.ex. 50" value={formData.weight || ''} onChange={handleChange} aria-invalid={!!errors.weight} />
          </FormField>
        </div>

        <div className={FormStyles.formGroup}>
          <FormField htmlFor="note" label="Notering" error={errors.note}>
            <FormTextarea id="note" name="note" placeholder="T.ex. morgonen" value={formData.note ?? ''} onChange={handleChange} aria-invalid={!!errors.note} />
          </FormField>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" size="md" loading={isSaving}>
              Logga vikt
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
