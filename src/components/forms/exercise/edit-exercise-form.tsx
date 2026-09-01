'use client';

//Components
import Button from '@/components/button/button';
import { updateExerciseAction } from '@/actions/exercise-actions';

//CSS Modules
import FormStyles from '@/components/forms/form.module.css';

//Types
import type { ExerciseViewModel } from '@/types/exercise-types';

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
  const [isSaving, setIsSaving] = useState(false);
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

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
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

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateExerciseAction(exericse.id, validation.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<UpdateExericseDto>(response.errors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/exercise');
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
        Edit
        <span> Exericse</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Name of the exercise
          </label>
          <input
            className={FormStyles.formInput}
            id="name"
            name="name"
            type="text"
            required
            placeholder="Example. squat"
            value={formData.name}
            onChange={handleChange}
          ></input>
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="muscleGroup">
            Muscle group
          </label>
          <input
            className={FormStyles.formInput}
            id="muscleGroup"
            name="muscleGroup"
            type="text"
            required
            placeholder="Example. arms"
            value={formData.muscleGroup}
            onChange={handleChange}
          ></input>
          {errors.muscleGroup && <p className={FormStyles.fieldErrorMessage}>{errors.muscleGroup}</p>}
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="equipment">
            Equipment
          </label>
          <input
            className={FormStyles.formInput}
            id="equipment"
            name="equipment"
            type="text"
            required
            placeholder="Example. Kettlebell"
            value={formData.equipment}
            onChange={handleChange}
          ></input>
          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Update exericse'}
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
