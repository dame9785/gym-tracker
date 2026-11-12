'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services/exercise-service';
import { registerExerciseSchema, updateExerciseSchema } from '@/schemas/exercise-schema';

import { uploadImage, cleanupUploadedImage } from '@/utils/image-upload';

import type { AppActionResult } from '@/types/action-types';
import type { ExerciseViewModel } from '@/types/exercise-types';

import { isValidId } from '@/utils/validation';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

const exerciseService = new ExerciseService();

function parseSecondaryMuscles(value: FormDataEntryValue | null): string[] {
  if (value === null || value === '') {
    return [];
  }

  if (typeof value !== 'string') {
    throw new Error('Invalid secondary muscle groups.');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Invalid secondary muscle groups.');
  }

  if (!Array.isArray(parsed) || !parsed.every((muscle: unknown) => typeof muscle === 'string')) {
    throw new Error('Invalid secondary muscle groups.');
  }

  return parsed;
}

function getOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);

  if (value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(`Invalid value for ${key}.`);
  }

  return value;
}

function getImageFile(formData: FormData): File | null {
  const image = formData.get('image');

  if (image === null) {
    return null;
  }

  if (!(image instanceof File)) {
    throw new Error('Invalid image file.');
  }

  return image.size > 0 ? image : null;
}

export async function registerExerciseAction(formData: FormData): Promise<AppActionResult<ExerciseViewModel>> {
  const user = await requireAuth();
  let uploadedImageUrl: string | undefined;

  try {
    const dto = {
      name: getOptionalString(formData, 'name') ?? '',
      primaryMuscle: getOptionalString(formData, 'primaryMuscle') ?? '',
      secondaryMuscles: parseSecondaryMuscles(formData.get('secondaryMuscles')),
      equipment: getOptionalString(formData, 'equipment') ?? '',
      description: getOptionalString(formData, 'description') ?? '',
      instructions: getOptionalString(formData, 'instructions') ?? '',
      techniqueTips: getOptionalString(formData, 'techniqueTips') ?? '',
    };

    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const image = getImageFile(formData);

    if (image) {
      uploadedImageUrl = await uploadImage(image, 'exercises');
    }

    const exercise = await exerciseService.registerExercise(
      {
        ...validation.data,
        ...(uploadedImageUrl ? { imagePath: uploadedImageUrl } : {}),
      },
      user.userId,
    );

    return {
      success: true,
      message: 'Exercise created successfully.',
      data: exercise,
    };
  } catch (error: unknown) {
    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function deleteExerciseAction(id: number): Promise<AppActionResult> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid exercise ID.',
    };
  }

  try {
    await exerciseService.delete(id, user.userId);

    return {
      success: true,
      message: 'Exercise deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function updateExerciseAction(id: number, formData: FormData): Promise<AppActionResult> {
  const user = await requireAuth();
  let uploadedImageUrl: string | undefined;

  try {
    if (!isValidId(id)) {
      return {
        success: false,
        message: 'Invalid exercise ID.',
      };
    }

    const dto: Record<string, unknown> = {};

    const stringFields = ['name', 'primaryMuscle', 'equipment', 'description', 'instructions', 'techniqueTips'] as const;

    for (const field of stringFields) {
      const value = getOptionalString(formData, field);

      if (value !== undefined) {
        dto[field] = value;
      }
    }

    if (formData.has('secondaryMuscles')) {
      dto.secondaryMuscles = parseSecondaryMuscles(formData.get('secondaryMuscles'));
    }

    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const image = getImageFile(formData);

    if (image) {
      uploadedImageUrl = await uploadImage(image, 'exercises');
    }

    await exerciseService.update(
      id,
      {
        ...validation.data,
        ...(uploadedImageUrl ? { imagePath: uploadedImageUrl } : {}),
      },
      user.userId,
    );

    return {
      success: true,
      message: 'Exercise updated successfully.',
    };
  } catch (error: unknown) {
    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
