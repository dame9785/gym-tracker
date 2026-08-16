'use client';

//Styles
import FormStyles from '@/components/forms/form.module.css';

//Services
import ExerciseService from '@/services/exercise-service';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';

//Alert
import { toast } from 'sonner';

//Next Link & Routing
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//Components
import Button from '@/components/button/button';
import { registerExerciseSchema } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

export default function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterExerciseDto, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    try {
      const response = await ExerciseService.register(validation.data);
      if (!response.success) {
        if (response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<RegisterExerciseDto>(response.errors));
        }
        toast.error('Något gick fel, övning kunde inte skapas');
        return;
      }
      toast.success('Övning skapad');
    } catch (error) {
      toast.error('Något gick fel, vikt blev inte loggad');
      return;
    } finally {
      router.push('/exercise');
    }
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Lägg till
        <span> Övning</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Namn
          </label>
          <input
            className={FormStyles.formInput}
            id="name"
            name="name"
            type="text"
            required
            placeholder="T.ex. knäböj"
            onChange={handleChange}
          ></input>
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="muscleGroup">
            Muskelgrupp
          </label>
          <input
            className={FormStyles.formInput}
            id="muscleGroup"
            name="muscleGroup"
            type="text"
            required
            placeholder="T.ex. ben"
            onChange={handleChange}
          ></input>
          {errors.muscleGroup && <p className={FormStyles.fieldErrorMessage}>{errors.muscleGroup}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="equipment">
            Redskap
          </label>
          <input
            className={FormStyles.formInput}
            id="equipment"
            name="equipment"
            type="text"
            required
            placeholder="T.ex. kettlebell / kroppsvikt"
            onChange={handleChange}
          ></input>
          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>
        <div className="grid grid-2">
          <Button type="submit" variant="primary">
            Lägg till övning
          </Button>
          <Link href="/exercise">
            <Button type="button" variant="secondary">
              Gå tillbaks
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
