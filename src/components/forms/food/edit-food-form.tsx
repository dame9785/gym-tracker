'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import FormStyles from '@/components/forms/form.module.css';
import { addFoodSchema, UpdateFoodDto } from '@/schemas/food-schemas';
import Button from '@/components/button/button';

import { updateFoodAction } from '@/actions/food-actions';
import { FoodViewModel } from '@/types/food-type';

type Props = {
  food: FoodViewModel;
};

export default function CreateFoodForm({ food }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<UpdateFoodDto>({
    name: food.name,
    caloriesPer100g: food.caloriesPer100g,
    proteinPer100g: food.proteinPer100g,
    carbsPer100g: food.carbsPer100g,
    fatPer100g: food.fatPer100g,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validate = addFoodSchema.safeParse(formData);
    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateFoodAction(validate.data, food.id);

      if (!response.success) {
        if (response.errors) {
          setErrors(response.errors);
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/foods');
    } catch (error) {
      console.error('Failed to create food:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${FormStyles.form} mx-auto`}>
      <h1 className={FormStyles.formTitle}>
        Lägg till
        <span> Mat</span>
      </h1>
      {/* namn */}
      <div className={FormStyles.formGroup}>
        <label htmlFor="name" className={FormStyles.formLabel}>
          Name
        </label>
        <input
          className={FormStyles.formInput}
          value={formData.name}
          id="name"
          name="name"
          type="text"
          step="0.1"
          placeholder="e.g. chicken"
          onChange={handleChange}
        ></input>
        {errors.name?.[0] && (
          <p id="name-error" className="text-red-500" role="alert">
            {errors.name[0]}
          </p>
        )}
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="caloriesPer100g" className={FormStyles.formLabel}>
          Calories Per/100g
        </label>
        <input
          className={FormStyles.formInput}
          value={formData.caloriesPer100g}
          id="caloriesPer100g"
          name="caloriesPer100g"
          type="number"
          step="0.1"
          placeholder="e.g. 50 cal"
          onChange={handleChange}
        ></input>
        {errors.caloriesPer100g?.[0] && (
          <p id="caloriesPer100g-error" className="text-red-500" role="alert">
            {errors.caloriesPer100g[0]}
          </p>
        )}
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="proteinPer100g" className={FormStyles.formLabel}>
          Protein Per/100g
        </label>
        <input
          className={FormStyles.formInput}
          value={formData.proteinPer100g}
          id="proteinPer100g"
          name="proteinPer100g"
          type="number"
          step="0.1"
          placeholder="e.g. 50 cal"
          onChange={handleChange}
        ></input>
        {errors.proteinPer100g?.[0] && (
          <p id="proteinPer100g-error" className="text-red-500" role="alert">
            {errors.proteinPer100g[0]}
          </p>
        )}
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="carbsPer100g" className={FormStyles.formLabel}>
          Carbs Per/100g
        </label>
        <input
          className={FormStyles.formInput}
          value={formData.carbsPer100g}
          id="carbsPer100g"
          name="carbsPer100g"
          type="number"
          step="0.1"
          placeholder="e.g. 50 cal"
          onChange={handleChange}
        ></input>
        {errors.carbsPer100g?.[0] && (
          <p id="carbsPer100g-error" className="text-red-500" role="alert">
            {errors.carbsPer100g[0]}
          </p>
        )}
      </div>
      <div className={FormStyles.formGroup}>
        <label htmlFor="fatPer100g" className={FormStyles.formLabel}>
          Fat Per/100g
        </label>
        <input
          className={FormStyles.formInput}
          value={formData.fatPer100g}
          id="fatPer100g"
          name="fatPer100g"
          type="number"
          step="0.1"
          placeholder="e.g. 50 cal"
          onChange={handleChange}
        ></input>
        {errors.fatPer100g?.[0] && (
          <p id="fatPer100g-error" className="text-red-500" role="alert">
            {errors.fatPer100g[0]}
          </p>
        )}
      </div>
      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Creating...' : 'Save'}
      </Button>
    </form>
  );
}
