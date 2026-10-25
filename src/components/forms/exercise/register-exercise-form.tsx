'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import FormStyles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';
import ImageUpload from '@/components/ui/image-upload';

import { registerExerciseAction } from '@/actions/exercise-actions';
import { registerExerciseSchema, type RegisterExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];

export default function RegisterForm() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [selectImage, setSelectedImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterExericseDto, string>>>({});

  const [formData, setFormData] = useState<RegisterExericseDto>({
    name: '',
    primaryMuscle: '',
    secondaryMuscles: [],
    equipment: '',
    description: '',
    instructions: '',
    techniqueTips: '',
  });

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
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);

    setFormData((prev) => ({
      ...prev,
      secondaryMuscles: selected,
    }));

    setErrors((prev) => ({
      ...prev,
      secondaryMuscles: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = registerExerciseSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<RegisterExericseDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const submission = new FormData();

      submission.set('name', validation.data.name);
      submission.set('primaryMuscle', validation.data.primaryMuscle);
      submission.set('secondaryMuscles', JSON.stringify(validation.data.secondaryMuscles));
      submission.set('equipment', validation.data.equipment ?? '');
      submission.set('description', validation.data.description);
      submission.set('instructions', validation.data.instructions);
      submission.set('techniqueTips', validation.data.techniqueTips ?? '');

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
        Add <span>exercise</span>
      </h1>

      <form className={FormStyles.form} onSubmit={handleSubmit}>
        <h2>Basic information</h2>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="name">
            Exercise name
          </label>

          <input
            className={FormStyles.formInput}
            id="name"
            name="name"
            type="text"
            placeholder="Example: Goblet Squat"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={50}
          />

          {errors.name && <p className={FormStyles.fieldErrorMessage}>{errors.name}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="primaryMuscle">
            Primary muscle group
          </label>

          <select className={FormStyles.formInput} id="primaryMuscle" name="primaryMuscle" value={formData.primaryMuscle} onChange={handleChange} required>
            <option value="">Select primary muscle group</option>
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
            size={5}
            value={formData.secondaryMuscles}
            onChange={handleSecondaryMuscleChange}
          >
            {MUSCLE_GROUPS.filter((muscle) => muscle !== formData.primaryMuscle).map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>

          <small>Hold Ctrl (Windows) or Command (Mac) to select multiple muscles.</small>

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
            placeholder="Example: Kettlebell"
            value={formData.equipment ?? ''}
            onChange={handleChange}
          />

          {errors.equipment && <p className={FormStyles.fieldErrorMessage}>{errors.equipment}</p>}
        </div>

        <h2>Exercise details</h2>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="description">
            Description
          </label>

          <textarea
            className={FormStyles.formInput}
            id="description"
            name="description"
            placeholder="Explain what the exercise trains and its benefits..."
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            maxLength={2000}
          />

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
            placeholder={'Explain how to perform the exercise step by step...'}
            value={formData.instructions}
            onChange={handleChange}
            required
            rows={6}
            maxLength={4000}
          />

          {errors.instructions && <p className={FormStyles.fieldErrorMessage}>{errors.instructions}</p>}
        </div>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="techniqueTips">
            Technique tips (optional)
          </label>

          <textarea
            className={FormStyles.formInput}
            id="techniqueTips"
            name="techniqueTips"
            placeholder="Common mistakes, posture and breathing tips..."
            value={formData.techniqueTips ?? ''}
            onChange={handleChange}
            rows={4}
            maxLength={2000}
          />

          {errors.techniqueTips && <p className={FormStyles.fieldErrorMessage}>{errors.techniqueTips}</p>}
        </div>

        <h2>Exercise image</h2>

        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel}>
            Image <span className="text-zinc-500">(optional)</span>
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
