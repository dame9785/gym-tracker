'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

import { registerExerciseAction } from '@/actions/exercise-actions';
import { registerExerciseSchema, type RegisterExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

import { FaCloudUploadAlt, FaImage, FaTimes } from 'react-icons/fa';

import ImageUpload from '@/components/ui/image-upload';

export default function RegisterForm() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [selectImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterExericseDto, string>>>({});

  const [formData, setFormData] = useState<RegisterExericseDto>({
    name: '',
    muscleGroup: '',
    equipment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP images are allowed.');
      e.target.value = '';
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('The image must be 5 MB or smaller.');
      e.target.value = '';
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);

    const input = document.getElementById('image') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = registerExerciseSchema.safeParse({
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    });

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<RegisterExericseDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const submission = new FormData();

      submission.set('name', validation.data.name);
      submission.set('muscleGroup', validation.data.muscleGroup);
      submission.set('equipment', validation.data.equipment ?? '');

      if (selectImage) {
        submission.set('image', selectImage);
      }

      const response = await registerExerciseAction(submission);

      if (!response.success) {
        if ('errors' in response && response.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<RegisterExericseDto>(response.errors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/exercise');
      router.refresh();
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

      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Name of the exercise
          </label>

          <input className={FormStyles.formInput} id="name" name="name" type="text" placeholder="Example: squat" value={formData.name} onChange={handleChange} required />

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
            placeholder="Example: arms"
            value={formData.muscleGroup}
            onChange={handleChange}
            required
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
            placeholder="Example: Kettlebell"
            value={formData.equipment ?? ''}
            onChange={handleChange}
          />

          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel}>
            Exercise image <span className="text-zinc-500">(optional)</span>
          </label>

          <ImageUpload file={selectImage} onFileChange={setSelectedImage} disabled={isSaving} />
        </div>

        <div className="flex justify-center gap-3">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create exercise'}
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
