'use client';

//Hooks
import { useState } from 'react';

//Styles
import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

//DTO:s
import RegisterExerciseDto from '@/dto/register-exercise.dto';

export default function RegisterForm() {
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
  };

  return (
    <div className="container">
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Lägg till
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
            type="text"
            required
            placeholder="T.ex. kettlebell / kroppsvikt"
            onChange={handleChange}
          ></input>
        </div>
        <Button type="submit" text="Lägg till övning" variant="primary"></Button>
      </form>
    </div>
  );
}
