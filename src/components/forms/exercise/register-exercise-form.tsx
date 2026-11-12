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

//Forms Components
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import FormTextarea from '@/components/ui/form-textarea';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body'];
const sectionClass = 'min-w-0 w-full rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 sm:p-7';

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
          const definedErrors = Object.fromEntries(Object.entries(response.errors).filter((entry): entry is [string, string[]] => Array.isArray(entry[1])));

          setErrors(ErrorsHelper.getFormErrorsFromApi<RegisterExericseDto>(definedErrors));
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/exercises');
    } catch (error) {
      console.error('Failed to create exercise:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = formData.secondaryMuscles?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-4xl min-w-0 px-3 pt-5 pb-8 sm:px-6 sm:pt-8 sm:pb-12 lg:pt-10">
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
            Add <span className="text-orange-400">exercise</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">Create an exercise with muscle groups, instructions and technique tips so you can use it in your workouts.</p>
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

      <form onSubmit={handleSubmit} className="min-w-0 space-y-4 sm:space-y-5">
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
            <FormField htmlFor="name" label="Exercise name" required error={errors.name} hint="Choose a clear, recognizable name." footer={`${formData.name.length}/50`}>
              <FormInput id="name" name="name" type="text" placeholder="e.g. Goblet squat" value={formData.name} onChange={handleChange} required maxLength={50} disabled={isSaving} aria-invalid={!!errors.name} />
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
              <FormInput id="equipment" name="equipment" type="text" placeholder="e.g. Kettlebell, dumbbells or none" value={formData.equipment ?? ''} onChange={handleChange} maxLength={50} disabled={isSaving} aria-invalid={!!errors.equipment} />
            </FormField>
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
            <FormField htmlFor="primaryMuscle" label="Primary muscle group" required error={errors.primaryMuscle}>
              <FormSelect id="primaryMuscle" name="primaryMuscle" value={formData.primaryMuscle} onChange={handleChange} required disabled={isSaving} aria-invalid={!!errors.primaryMuscle}>
                <option value="" disabled className="bg-zinc-900">
                  Select the main muscle group
                </option>

                {MUSCLE_GROUPS.map((muscle) => (
                  <option key={muscle} value={muscle} className="bg-zinc-900">
                    {muscle}
                  </option>
                ))}
              </FormSelect>
            </FormField>

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
                        selected ? 'border-orange-500/60 bg-orange-500/10 text-orange-300' : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/70 hover:text-zinc-200'
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
            <FormField htmlFor="description" label="Description" required error={errors.description} hint="Describe the purpose and benefits." footer={`${formData.description.length}/2000`}>
              <FormTextarea id="description" name="description" placeholder="Explain what the exercise trains and its benefits..." value={formData.description} onChange={handleChange} required rows={4} maxLength={2000} disabled={isSaving} aria-invalid={!!errors.description} className="min-h-32" />
            </FormField>

            <FormField htmlFor="instructions" label="Instructions" required error={errors.instructions} hint="Explain the movement step by step." footer={`${formData.instructions.length}/4000`}>
              <FormTextarea
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
                className="min-h-40"
              />
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

        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-xl sm:sticky sm:bottom-3 sm:z-10 sm:flex-row sm:justify-end sm:backdrop-blur-xl">
          <Link href="/exercises" className="w-full sm:w-auto">
            <span className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </span>
          </Link>

          <Button type="submit" variant="primary" disabled={isSaving}>
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
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
