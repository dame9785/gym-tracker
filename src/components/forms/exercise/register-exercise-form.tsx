'use client';

//Hooks
import { useState } from 'react';

//Link
import { useRouter } from 'next/navigation';

//Styles
import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

//Services
import ExerciseService from '@/services/exercise-service';

//DTO:s
import RegisterExerciseDto from '@/dto/register-exercise.dto';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();

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

    const registerDto: RegisterExerciseDto = {
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    };

    if (registerDto.name === '' || registerDto.muscleGroup === '' || registerDto.equipment === '') {
      toast.error('Alla fält måste fyllas i');
      return;
    }

    const result = await ExerciseService.register(registerDto);
    console.log(result);
    if (!result.success) {
      toast.error('Något gick fel. Övning ej skapad');
    }

    toast.success('Övning blev skapad');
    router.push('/exercise');
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
        </div>
        <div className="flex gap-2">
          <Button type="submit" text="Lägg till övning" variant="primary"></Button>
          <Link href="/exercise">
            <Button type="button" text="Gå tillbaks" variant="secondary" />
          </Link>
        </div>
      </form>
    </div>
  );
}
