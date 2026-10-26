'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Check, Dumbbell, FileText, Image as ImageIcon, LoaderCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/button/button';
import { updateExerciseAction } from '@/actions/exercise-actions';
import ImageUpload from '@/components/ui/image-upload';
import type { ExerciseViewModel } from '@/types/exercise-types';
import { updateExerciseSchema, type UpdateExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

type Props = {
  exericse: ExerciseViewModel;
};

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const inputClass =
  'w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15';

const labelClass = 'mb-2 block text-sm font-medium text-zinc-200';

const sectionClass = 'rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-7';

export default function EditExercise({ exericse }: Props) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const selectedCount = formData.secondaryMuscles?.length ?? 0;

  const availableSecondaryMuscles = MUSCLE_GROUPS.filter((muscle) => muscle !== formData.primaryMuscle);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 lg:pt-10">
      {/* Page header */}
      <div className="mb-8 flex items-start gap-4">
        <Link
          href="/exercises"
          aria-label="Back to exercises"
          className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
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
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Editing exercise</p>
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
            <div>
              <label className={labelClass} htmlFor="name">
                Exercise name <span className="text-orange-400">*</span>
              </label>
              <input
                className={inputClass}
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Goblet squat"
                value={formData.name ?? ''}
                onChange={handleChange}
                required
                maxLength={50}
                disabled={isSaving}
                aria-invalid={!!errors.name}
              />
              <div className="mt-1.5 flex justify-between gap-3">
                {errors.name ? <p className="text-xs text-red-400">{errors.name}</p> : <span className="text-xs text-zinc-500">Use a clear, recognizable name.</span>}
                <span className="shrink-0 text-xs text-zinc-500">{(formData.name ?? '').length}/50</span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="equipment">
                Equipment <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                className={inputClass}
                id="equipment"
                name="equipment"
                type="text"
                placeholder="e.g. Kettlebell or dumbbells"
                value={formData.equipment ?? ''}
                onChange={handleChange}
                maxLength={50}
                disabled={isSaving}
                aria-invalid={!!errors.equipment}
              />
              {errors.equipment && <p className="mt-1.5 text-xs text-red-400">{errors.equipment}</p>}
            </div>
          </div>
        </section>

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

          <div className="space-y-6">
            <div>
              <label className={labelClass} htmlFor="primaryMuscle">
                Primary muscle group <span className="text-orange-400">*</span>
              </label>

              <select
                className={inputClass}
                id="primaryMuscle"
                name="primaryMuscle"
                value={formData.primaryMuscle ?? ''}
                onChange={handleChange}
                required
                disabled={isSaving}
                aria-invalid={!!errors.primaryMuscle}
              >
                <option value="" disabled className="bg-zinc-900">
                  Select the main muscle group
                </option>
                {MUSCLE_GROUPS.map((muscle) => (
                  <option key={muscle} value={muscle} className="bg-zinc-900">
                    {muscle}
                  </option>
                ))}
              </select>

              {errors.primaryMuscle && <p className="mt-1.5 text-xs text-red-400">{errors.primaryMuscle}</p>}
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium text-zinc-200">Secondary muscle groups</label>
                <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">{selectedCount} selected</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableSecondaryMuscles.map((muscle) => {
                  const selected = formData.secondaryMuscles?.includes(muscle) ?? false;

                  return (
                    <button
                      key={muscle}
                      type="button"
                      disabled={isSaving}
                      aria-pressed={selected}
                      onClick={() => toggleSecondaryMuscle(muscle)}
                      className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        selected
                          ? 'border-orange-500/60 bg-orange-500/10 text-orange-300'
                          : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/70 hover:text-zinc-200'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span>{muscle}</span>
                      {selected ? <Check className="h-4 w-4 shrink-0 text-orange-400" /> : <Plus className="h-4 w-4 shrink-0 text-zinc-600" />}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-500">Click a muscle to select or deselect it. The primary muscle cannot also be selected as secondary.</p>

              {errors.secondaryMuscles && <p className="mt-1.5 text-xs text-red-400">{errors.secondaryMuscles}</p>}
            </div>
          </div>
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
            <div>
              <label className={labelClass} htmlFor="description">
                Description <span className="text-orange-400">*</span>
              </label>
              <textarea
                className={`${inputClass} min-h-32 resize-y leading-6`}
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
              />
              <div className="mt-1.5 flex justify-between gap-3">
                {errors.description ? (
                  <p className="text-xs text-red-400">{errors.description}</p>
                ) : (
                  <span className="text-xs text-zinc-500">Describe the purpose and benefits.</span>
                )}
                <span className="shrink-0 text-xs text-zinc-500">{(formData.description ?? '').length}/2000</span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="instructions">
                Instructions <span className="text-orange-400">*</span>
              </label>
              <textarea
                className={`${inputClass} min-h-40 resize-y leading-6`}
                id="instructions"
                name="instructions"
                placeholder="Describe the movement step by step..."
                value={formData.instructions ?? ''}
                onChange={handleChange}
                required
                rows={5}
                maxLength={4000}
                disabled={isSaving}
                aria-invalid={!!errors.instructions}
              />
              <div className="mt-1.5 flex justify-between gap-3">
                {errors.instructions ? (
                  <p className="text-xs text-red-400">{errors.instructions}</p>
                ) : (
                  <span className="text-xs text-zinc-500">Explain how to perform the exercise.</span>
                )}
                <span className="shrink-0 text-xs text-zinc-500">{(formData.instructions ?? '').length}/4000</span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="techniqueTips">
                Technique tips <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <textarea
                className={`${inputClass} min-h-28 resize-y leading-6`}
                id="techniqueTips"
                name="techniqueTips"
                placeholder="Posture, breathing, common mistakes and useful tips..."
                value={formData.techniqueTips ?? ''}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                disabled={isSaving}
                aria-invalid={!!errors.techniqueTips}
              />
              <div className="mt-1.5 flex justify-between gap-3">
                {errors.techniqueTips ? (
                  <p className="text-xs text-red-400">{errors.techniqueTips}</p>
                ) : (
                  <span className="text-xs text-zinc-500">Help users perform the exercise safely and effectively.</span>
                )}
                <span className="shrink-0 text-xs text-zinc-500">{(formData.techniqueTips ?? '').length}/2000</span>
              </div>
            </div>
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

          <ImageUpload
            file={selectedImage}
            onFileChange={handleImageChange}
            currentImageUrl={exericse.imagePath}
            currentImageAlt={`Current image of ${exericse.name}`}
            disabled={isSaving}
          />

          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Optional. JPG, PNG or WebP, maximum 5 MB. Leave the current image unchanged if you do not choose another one.
          </p>
        </section>

        {/* Form actions */}
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:justify-end">
          <Link
            href="/exercises"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
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
