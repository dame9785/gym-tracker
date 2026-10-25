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
import ImageUpload from '@/components/ui/image-upload';

type Props = {
  exericse: ExerciseViewModel;
};

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];

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
    primaryMuscle: exericse.primaryMuscle,
    secondaryMuscles: exericse.secondaryMuscles,
    equipment: exericse.equipment ?? '',
    description: exericse.description,
    instructions: exericse.instructions,
    techniqueTips: exericse.techniqueTips ?? '',
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSecondaryMuscleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const secondaryMuscles = Array.from(e.target.selectedOptions, (option) => option.value);

    setFormData((prev) => ({
      ...prev,
      secondaryMuscles,
    }));

    setErrors((prev) => ({
      ...prev,
      secondaryMuscles: undefined,
    }));
  };

  const handleImageChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('The image must be 5 MB or smaller.');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = updateExerciseSchema.safeParse({
      name: formData.name,
      primaryMuscle: formData.primaryMuscle,
      secondaryMuscles: formData.secondaryMuscles ?? [],
      equipment: formData.equipment ?? '',
      description: formData.description,
      instructions: formData.instructions,
      techniqueTips: formData.techniqueTips ?? '',
    });

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateExericseDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const submission = new FormData();
      const validated = validation.data;

      if (validated.name !== undefined) {
        submission.set('name', validated.name);
      }

      if (validated.primaryMuscle !== undefined) {
        submission.set('primaryMuscle', validated.primaryMuscle);
      }

      if (validated.secondaryMuscles !== undefined) {
        submission.set('secondaryMuscles', JSON.stringify(validated.secondaryMuscles));
      }

      if (validated.equipment !== undefined) {
        submission.set('equipment', validated.equipment);
      }

      if (validated.description !== undefined) {
        submission.set('description', validated.description);
      }

      if (validated.instructions !== undefined) {
        submission.set('instructions', validated.instructions);
      }

      if (validated.techniqueTips !== undefined) {
        submission.set('techniqueTips', validated.techniqueTips);
      }

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
      router.refresh();
    } catch (error) {
      console.error('Failed to update exercise:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const availableSecondaryMuscles = MUSCLE_GROUPS.filter((muscle) => muscle !== formData.primaryMuscle);

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
          <input className={FormStyles.formInput} id="name" name="name" type="text" required value={formData.name ?? ''} onChange={handleChange} />
          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="primaryMuscle">
            Primary muscle group
          </label>
          <select className={FormStyles.formInput} id="primaryMuscle" name="primaryMuscle" required value={formData.primaryMuscle ?? ''} onChange={handleChange}>
            <option value="" disabled>
              Select primary muscle group
            </option>
            {MUSCLE_GROUPS.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
          {errors.primaryMuscle && <p className={FormStyles.fieldErrorMessage}>{errors.primaryMuscle}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="secondaryMuscles">
            Secondary muscle groups
          </label>
          <select
            className={FormStyles.formInput}
            id="secondaryMuscles"
            name="secondaryMuscles"
            multiple
            value={formData.secondaryMuscles ?? []}
            onChange={handleSecondaryMuscleChange}
          >
            {availableSecondaryMuscles.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-zinc-500">Hold Ctrl (Windows) or Command (Mac) to select multiple groups.</p>
          {errors.secondaryMuscles && <p className={FormStyles.fieldErrorMessage}>{errors.secondaryMuscles}</p>}
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
            value={formData.equipment ?? ''}
            onChange={handleChange}
            placeholder="Example: Kettlebell"
          />
          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="description">
            Description
          </label>
          <textarea className={FormStyles.formInput} id="description" name="description" required rows={4} value={formData.description ?? ''} onChange={handleChange} />
          {errors.description && <p className={FormStyles.fieldErrorMessage}>{errors.description}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="instructions">
            Instructions
          </label>
          <textarea
            className={FormStyles.formInput}
            id="instructions"
            name="instructions"
            required
            rows={5}
            value={formData.instructions ?? ''}
            onChange={handleChange}
          />
          {errors.instructions && <p className={FormStyles.fieldErrorMessage}>{errors.instructions}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="techniqueTips">
            Technique tips (optional)
          </label>
          <textarea className={FormStyles.formInput} id="techniqueTips" name="techniqueTips" rows={4} value={formData.techniqueTips ?? ''} onChange={handleChange} />
          {errors.techniqueTips && <p className={FormStyles.fieldErrorMessage}>{errors.techniqueTips}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel}>
            Exercise image <span className="text-zinc-500">(optional)</span>
          </label>

          <ImageUpload
            file={selectedImage}
            onFileChange={handleImageChange}
            currentImageUrl={exericse.imagePath}
            currentImageAlt={`Current image of ${exericse.name}`}
            disabled={isSaving}
          />

          <p className="mt-2 text-sm text-zinc-500">Leave the current image unchanged by not selecting a new one.</p>
        </div>

        <div className="flex justify-center gap-3">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Update exercise'}
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
