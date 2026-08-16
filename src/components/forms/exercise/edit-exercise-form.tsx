'use client';

//Components
import Button from '@/components/button/button';
import ExerciseService from '@/services/exercise-service';

//CSS Modules
import FormStyles from '@/components/forms/form.module.css';

//Types
import type { ExerciseViewModel, RegisterExerciseDto } from '@/types/exercise-types';

//Toast alert
import { toast } from 'sonner';

//Next &  Routing
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { updateExerciseSchema, UpdateExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  exericse: ExerciseViewModel;
};

export default function EditExercise({ exericse }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateExericseDto, string>>>({});

  const [formData, setFormData] = useState<UpdateExericseDto>({
    name: exericse.name,
    muscleGroup: exericse.muscleGroup,
    equipment: exericse.equipment || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const exericseDto = {
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    };

    const validation = updateExerciseSchema.safeParse(exericseDto);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateExericseDto>(validation.error.issues));
      return;
    }

    try {
      const response = await ExerciseService.update(exericse.id, validation.data);
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
        Redigera
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
            value={formData.name}
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
            value={formData.muscleGroup}
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
            value={formData.equipment}
            onChange={handleChange}
          ></input>
          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            Uppdatera
          </Button>
          <Link href="/exercise">
            <Button type="submit" variant="secondary">
              Gå tillbaks
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
