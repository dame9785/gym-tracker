'use client';

import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';
import ExerciseService from '@/services/exercise-service';
import { useEffect, useState } from 'react';
import RegisterExerciseDto from '@/dto/register-exercise.dto';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
type Props = {
  exerciseId: string;
};

export default function EditExercise({ exerciseId }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterExerciseDto>({
    name: '',
    muscleGroup: '',
    equipment: '',
  });

  useEffect(() => {
    const fetchExercise = async () => {
      const result = await ExerciseService.getById(exerciseId);

      const exericse = result.exericse;
      if (!exericse) {
        toast.error('Gick inte att hämta övning');
        return;
      }

      setFormData({
        name: exericse.name,
        muscleGroup: exericse.muscleGroup,
        equipment: exericse.equipment,
      });
    };

    fetchExercise();
  }, [exerciseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerDto: RegisterExerciseDto = {
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    };

    if (registerDto.name === '' || registerDto.muscleGroup === '' || registerDto.equipment === '') {
      toast.error('Alla fält måste fyllas i');
      return;
    }
    const result = await ExerciseService.edit(exerciseId, registerDto);
    if (!result.success) {
      toast.error('Uppdateringen misslyckades, försök igen');
    }
    toast.success('Uppdateringen lyckades');
    router.push('/exercise');
  };

  return (
    <div className="container">
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Redigera
          <span> Övning</span>
        </h1>
      </div>

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
        </div>
        <Button type="submit" text="Lägg till övning" variant="primary"></Button>
      </form>
    </div>
  );
}
