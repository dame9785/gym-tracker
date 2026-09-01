'use client';

import FormStyles from '@/components/forms/form.module.css';

import { registerExerciseAction } from '@/actions/exercise-actions';

import type { RegisterExerciseDto } from '@/types/exercise-types';

import { toast } from 'sonner';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/button/button';
import { registerExerciseSchema } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

export default function RegisterForm() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterExerciseDto, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const [formData, setFormData] = useState<RegisterExerciseDto>({
    name: '',
    muscleGroup: '',
    equipment: '',
  });

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const exerciseDto = {
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    };

    const validation = registerExerciseSchema.safeParse(exerciseDto);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<RegisterExerciseDto>(validation.error.issues));

      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await registerExerciseAction(validation.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<RegisterExerciseDto>(response.errors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/exercise');
    } catch (error) {
      console.error('Failed to create exercise:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Add
        <span> exercise</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Name of the exercise
          </label>
          <input className={FormStyles.formInput} id="name" name="name" type="text" placeholder="Example. squat" onChange={handleChange}></input>
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="muscleGroup">
            Muscle group
          </label>
          <input className={FormStyles.formInput} id="muscleGroup" name="muscleGroup" type="text" placeholder="Example. arms" onChange={handleChange}></input>
          {errors.muscleGroup && <p className={FormStyles.fieldErrorMessage}>{errors.muscleGroup}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="equipment">
            Equipment
          </label>
          <input className={FormStyles.formInput} id="equipment" name="equipment" type="text" placeholder="Example. Kettlebell" onChange={handleChange}></input>
          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>
        <div className="grid grid-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Create exericse'}
          </Button>
          <Link href="/exercise">
            <Button type="button" variant="secondary">
              Go back
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
