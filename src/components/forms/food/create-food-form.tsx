'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import FoodsService from '@/services/food-service';
import { toast } from 'sonner';
import FormStyles from '@/components/forms/form.module.css';
import { FoodDto } from '@/types/food-type';

export default function CreateFoodForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FoodDto>({
    name: '',
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    console.log(formData);
    return;

    try {
      const response = await FoodsService.create(formData);
      if (!response.success) {
        toast.error('Något gick fel, försök igen');
      }

      toast.success('Food created sucsefully');
      router.push('/foods');
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
      {/* namn */}
      <div className={FormStyles.formGroup}>
        <label htmlFor="name" className={FormStyles.formLabel}>
          Name
        </label>
        <input onChange={handleChange} required id="name" type="text" className={FormStyles.formInput} placeholder="T.ex. Kyckling"></input>
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="caloriesPer100g" className={FormStyles.formLabel}>
          Calories Per/100g
        </label>
        <input onChange={handleChange} required id="caloriesPer100g" type="text" className={FormStyles.formInput} placeholder="T.ex. 400 cal"></input>
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="protein" className={FormStyles.formLabel}>
          Protein Per/100g
        </label>
        <input required id="protein" type="text" className={FormStyles.formInput} placeholder="T.ex. 400g"></input>
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="carbs" className={FormStyles.formLabel}>
          Carbs Per/100g
        </label>
        <input onChange={handleChange} required id="carbs" type="text" className={FormStyles.formInput} placeholder="T.ex. 400g"></input>
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="fat" className={FormStyles.formLabel}>
          Fat Per/100g
        </label>
        <input onChange={handleChange} required id="fat" type="text" className={FormStyles.formInput} placeholder="T.ex. 400g"></input>
      </div>
      <button type="submit" className={FormStyles.submitButton}>
        Spara Workout
      </button>
    </form>
  );
}
