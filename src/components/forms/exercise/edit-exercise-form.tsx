'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Check, Dumbbell, FileText, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/button/button';
import ImageUpload from '@/components/ui/image-upload';
import MuscleGroupSelector from '@/components/forms/exercise/muscle-group-selector';

//Forms Components
import FormTextarea from '@/components/ui/form-textarea';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

import { updateExerciseAction } from '@/actions/exercise-actions';
import type { ExerciseViewModel } from '@/types/exercise-types';
import { updateExerciseSchema, type UpdateExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  exericse: ExerciseViewModel;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const sectionClass = 'rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-7';

export default function EditExercise({ exericse }: Props) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'primaryMuscle' && {
        secondaryMuscles: (prev.secondaryMuscles ?? []).filter((muscle) => muscle !== value),
      }),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === 'primaryMuscle' && {
        secondaryMuscles: undefined,
      }),
    }));
  };

  const toggleSecondaryMuscle = (muscle: string) => {
    setFormData((prev) => {
      const current = prev.secondaryMuscles ?? [];

      return {
        ...prev,
        secondaryMuscles: current.includes(muscle) ? current.filter((item) => item !== muscle) : [...current, muscle],
      };
    });

    setErrors((prev) => ({
      ...prev,
      secondaryMuscles: undefined,
    }));
  };

  const handlePrimaryMuscleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryMuscle: value,
      secondaryMuscles: (prev.secondaryMuscles ?? []).filter((muscle) => muscle !== value),
    }));

    setErrors((prev) => ({
      ...prev,
      primaryMuscle: undefined,
      secondaryMuscles: undefined,
    }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setSelectedImage(null);
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
      toast.error('Please check the highlighted fields.');
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
          const definedErrors = Object.fromEntries(Object.entries(response.errors).filter((entry): entry is [string, string[]] => Array.isArray(entry[1])));

          setErrors(ErrorsHelper.getFormErrorsFromApi<UpdateExericseDto>(definedErrors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/exercises');
    } catch (error) {
      console.error('Failed to update exercise:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-12 sm:px-6 lg:pt-10">
      {/* Page header */}
      <div className="mb-8 flex items-start gap-4">
        <Link href="/exercises" aria-label="Back to exercises" className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-400">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">
            <Dumbbell className="h-4 w-4" />
            Exercise library
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Edit <span className="text-orange-400">exercise</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">Update the muscle groups, instructions and other details for this exercise.</p>
        </div>
      </div>

      {/* Current exercise */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          <Activity className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">Editing exercise</p>
          <p className="mt-1 truncate font-semibold text-white">{exericse.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic information */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Dumbbell className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Basic information</h2>
              <p className="mt-1 text-xs text-zinc-500">Name and equipment</p>
            </div>
          </div>

          <div className="space-y-5">
            <FormField htmlFor="name" label="Exercise name" required error={errors.name} hint="Use a clear, recognizable name." footer={`${(formData.name ?? '').length}/50`}>
              <FormInput id="name" name="name" type="text" placeholder="e.g. Goblet squat" value={formData.name ?? ''} onChange={handleChange} required maxLength={50} disabled={isSaving} aria-invalid={!!errors.name} />
            </FormField>

            <FormField
              htmlFor="equipment"
              label={
                <>
                  Equipment <span className="font-normal text-zinc-500">(optional)</span>
                </>
              }
              error={errors.equipment}
            >
              <FormInput id="equipment" name="equipment" type="text" placeholder="e.g. Kettlebell or dumbbells" value={formData.equipment ?? ''} onChange={handleChange} maxLength={50} disabled={isSaving} aria-invalid={!!errors.equipment} />
            </FormField>
          </div>
        </section>

        {/* Muscle groups */}
        {/* Muscle groups */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Muscle groups</h2>
              <p className="mt-1 text-xs text-zinc-500">Choose the primary muscle and any assisting muscles.</p>
            </div>
          </div>

          <MuscleGroupSelector
            primaryMuscle={formData.primaryMuscle ?? ''}
            secondaryMuscles={formData.secondaryMuscles ?? []}
            onPrimaryMuscleChange={handlePrimaryMuscleChange}
            onToggleSecondaryMuscle={toggleSecondaryMuscle}
            primaryError={errors.primaryMuscle}
            secondaryError={errors.secondaryMuscles}
            disabled={isSaving}
          />
        </section>

        {/* Exercise details */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Exercise details</h2>
              <p className="mt-1 text-xs text-zinc-500">Description, instructions and technique tips</p>
            </div>
          </div>

          <div className="space-y-5">
            <FormField htmlFor="description" label="Description" required error={errors.description} hint="Describe the purpose and benefits." footer={`${(formData.description ?? '').length}/2000`}>
              <FormTextarea
                id="description"
                name="description"
                placeholder="Explain what the exercise trains and its benefits..."
                value={formData.description ?? ''}
                onChange={handleChange}
                required
                rows={4}
                maxLength={2000}
                disabled={isSaving}
                aria-invalid={!!errors.description}
                className="min-h-32"
              />
            </FormField>

            <FormField htmlFor="instructions" label="Instructions" required error={errors.instructions} hint="Explain how to perform the exercise." footer={`${(formData.instructions ?? '').length}/4000`}>
              <FormTextarea id="instructions" name="instructions" placeholder="Describe the movement step by step..." value={formData.instructions ?? ''} onChange={handleChange} required rows={5} maxLength={4000} disabled={isSaving} aria-invalid={!!errors.instructions} className="min-h-40" />
            </FormField>

            <FormField
              htmlFor="techniqueTips"
              label={
                <>
                  Technique tips <span className="font-normal text-zinc-500">(optional)</span>
                </>
              }
              error={errors.techniqueTips}
              hint="Help users perform the exercise safely and effectively."
              footer={`${(formData.techniqueTips ?? '').length}/2000`}
            >
              <FormTextarea
                id="techniqueTips"
                name="techniqueTips"
                placeholder="Posture, breathing, common mistakes and useful tips..."
                value={formData.techniqueTips ?? ''}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                disabled={isSaving}
                aria-invalid={!!errors.techniqueTips}
                className="min-h-28"
              />
            </FormField>
          </div>
        </section>

        {/* Image */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ImageIcon className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Exercise image</h2>
              <p className="mt-1 text-xs text-zinc-500">Replace the existing image or keep it as it is.</p>
            </div>
          </div>

          <ImageUpload file={selectedImage} onFileChange={handleImageChange} currentImageUrl={exericse.imagePath} currentImageAlt={`Current image of ${exericse.name}`} disabled={isSaving} />

          <p className="mt-3 text-xs leading-5 text-zinc-500">Optional. JPG, PNG or WebP, maximum 5 MB. Leave the current image unchanged if you do not choose another one.</p>
        </section>

        {/* Form actions */}
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:justify-end">
          <Link href="/exercises" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>

          <Button type="submit" variant="primary" disabled={isSaving}>
            <span className="inline-flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save changes
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
