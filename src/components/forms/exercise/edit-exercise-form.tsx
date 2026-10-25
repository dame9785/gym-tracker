'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import Button from '@/components/button/button';
import { updateExerciseAction } from '@/actions/exercise-actions';
import FormStyles from '@/components/forms/form.module.css';

import type { ExerciseViewModel } from '@/types/exercise-types';
import { updateExerciseSchema, type UpdateExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  exericse: ExerciseViewModel;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function EditExercise({ exericse }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateExericseDto, string>>>({});

  const [formData, setFormData] = useState<UpdateExericseDto>({
    name: exericse.name,
    muscleGroup: exericse.muscleGroup,
    equipment: exericse.equipment || '',
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Välj en JPG-, PNG- eller WebP-bild.');
      e.target.value = '';
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Bilden får vara högst 5 MB.');
      e.target.value = '';
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const exerciseDto = {
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    };

    const validation = updateExerciseSchema.safeParse(exerciseDto);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateExericseDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const submission = new FormData();

      submission.set('name', validation.data.name);
      submission.set('muscleGroup', validation.data.muscleGroup);
      submission.set('equipment', validation.data.equipment ?? '');

      if (selectedImage) {
        submission.set('image', selectedImage);
      }

      const response = await updateExerciseAction(exericse.id, submission);

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
        Edit <span>Exercise</span>
      </h1>

      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Name of the exercise
          </label>

          <input className={FormStyles.formInput} id="name" name="name" type="text" required placeholder="Example: squat" value={formData.name} onChange={handleChange} />

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
            placeholder="Example: arms"
            value={formData.muscleGroup}
            onChange={handleChange}
          />

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
            placeholder="Example: Kettlebell"
            value={formData.equipment}
            onChange={handleChange}
          />

          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="image">
            Exercise image
          </label>

          {imagePreview ? (
            <div className="mb-3">
              <p className="mb-2 text-sm">New image preview</p>
              <img src={imagePreview} alt="Preview of the new exercise image" className="h-48 w-full rounded-lg border border-gray-300 object-contain" />
            </div>
          ) : exericse.imagePath ? (
            <div className="mb-3">
              <p className="mb-2 text-sm">Current image</p>
              <img src={exericse.imagePath} alt={`Current image of ${exericse.name}`} className="h-48 w-full rounded-lg border border-gray-300 object-contain" />
            </div>
          ) : (
            <p className="mb-3 text-sm">No image selected yet.</p>
          )}

          <input className={FormStyles.formInput} id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />

          <p className="mt-1 text-sm text-gray-500">JPG, PNG or WebP. Maximum 5 MB. Leave empty to keep the current image.</p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Update exercise'}
          </Button>

          <Link href="/exercise">
            <Button type="button" variant="secondary">
              Gå tillbaka
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
