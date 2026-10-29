'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Check, Dumbbell, FileText, Image as ImageIcon, LoaderCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/button/button';
import ImageUpload from '@/components/ui/image-upload';

import { registerExerciseAction } from '@/actions/exercise-actions';
import { registerExerciseSchema, type RegisterExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];

const inputClass =
  'w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15';

const labelClass = 'mb-2 block text-sm font-medium text-zinc-200';

const sectionClass = 'rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-7';

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
      ...(name === 'primaryMuscle' && {
        secondaryMuscles: (prev.secondaryMuscles ?? []).filter((muscle) => muscle !== value),
      }),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === 'primaryMuscle' && { secondaryMuscles: undefined }),
    }));
  };

  const toggleSecondaryMuscle = (muscle: string) => {
    setFormData((prev) => {
      const current = prev.secondaryMuscles ?? [];
      const secondaryMuscles = current.includes(muscle) ? current.filter((item) => item !== muscle) : [...current, muscle];

      return { ...prev, secondaryMuscles };
    });

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
      toast.error('Please check the highlighted fields.');
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

  const selectedCount = formData.secondaryMuscles?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 lg:pt-10">
      {/* Page header */}
      <div className="mb-8 flex items-start gap-4">
        <Link
          href="/exercise"
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
            Add <span className="text-orange-400">exercise</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Create an exercise with muscle groups, instructions and technique tips so you can use it in your workouts.
          </p>
        </div>
      </div>

      {/* Progress / info strip */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-100">Build your exercise</p>
          <p className="mt-0.5 text-xs text-zinc-400">Fields marked as required must be completed.</p>
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
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={50}
                disabled={isSaving}
                aria-invalid={!!errors.name}
              />
              <div className="mt-1.5 flex justify-between gap-3">
                {errors.name ? <p className="text-xs text-red-400">{errors.name}</p> : <span className="text-xs text-zinc-500">Choose a clear, recognizable name.</span>}
                <span className="shrink-0 text-xs text-zinc-500">{formData.name.length}/50</span>
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
                placeholder="e.g. Kettlebell, dumbbells or none"
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
              <p className="mt-1 text-xs text-zinc-500">Select the main muscle and any assisting muscles.</p>
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
                value={formData.primaryMuscle}
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
                {MUSCLE_GROUPS.filter((muscle) => muscle !== formData.primaryMuscle).map((muscle) => {
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

              <p className="mt-3 text-xs leading-5 text-zinc-500">Select all muscles that assist during the exercise. Click a selected muscle again to remove it.</p>

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
              <p className="mt-1 text-xs text-zinc-500">Explain the exercise and how to perform it.</p>
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
                value={formData.description}
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
                <span className="shrink-0 text-xs text-zinc-500">{formData.description.length}/2000</span>
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
                placeholder={'1. Set up your starting position.\n2. Perform the movement with control.\n3. Return to the starting position.'}
                value={formData.instructions}
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
                  <span className="text-xs text-zinc-500">Explain the movement step by step.</span>
                )}
                <span className="shrink-0 text-xs text-zinc-500">{formData.instructions.length}/4000</span>
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

        {/* Image upload */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Exercise image</h2>
              <p className="mt-1 text-xs text-zinc-500">Add a visual reference for your exercise.</p>
            </div>
          </div>

          <ImageUpload file={selectImage} onFileChange={setSelectedImage} disabled={isSaving} />

          <p className="mt-3 text-xs leading-5 text-zinc-500">Optional. JPG, PNG or WebP, maximum 5 MB.</p>
        </section>

        {/* Form actions */}
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:justify-end">
          <Link href="/exercise" className="sm:flex-none">
            <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </span>
          </Link>

          <Button type="submit" variant="primary" disabled={isSaving}>
            <span className="inline-flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating exercise...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create exercise
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
