'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import { registerExerciseSchema, updateExerciseSchema } from '@/schemas/exercise-schema';

import { put, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

import type { ExerciseViewModel } from '@/types/exercise-types';

const exerciseService = new ExerciseService();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface ExerciseActionError {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

export interface ExerciseActionSuccess<T = undefined> {
  success: true;
  message?: string;
  data?: T;
}

export type ExerciseActionResult<T = undefined> = ExerciseActionSuccess<T> | ExerciseActionError;

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

function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');
  }

  return token;
}

async function uploadExerciseImage(image: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    throw new Error('Only JPEG, PNG and WebP images are allowed.');
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error('The image must be 5 MB or smaller.');
  }

  const token = getBlobToken();
  const extension = EXTENSION_BY_TYPE[image.type];

  const blob = await put(`exercises/${randomUUID()}.${extension}`, image, {
    access: 'public',
    token,
    contentType: image.type,
  });

  return blob.url;
}

async function cleanupUploadedImage(url: string | undefined): Promise<void> {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN) {
    return;
  }

  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error: unknown) {
    console.error('Failed to clean up uploaded image:', error);
  }
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

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const safeMessages = ['Only JPEG, PNG and WebP images are allowed.', 'The image must be 5 MB or smaller.', 'Invalid secondary muscle groups.', 'Invalid image file.'];

  if (safeMessages.includes(error.message) || error.message.startsWith('Invalid value for ')) {
    return error.message;
  }

  if (error.message.startsWith('Validation failed:')) {
    return error.message;
  }

  return fallback;
}

export async function registerExerciseAction(formData: FormData): Promise<ExerciseActionResult<ExerciseViewModel>> {
  let uploadedImageUrl: string | undefined;

  try {
    const user = await requireAuth();

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
      uploadedImageUrl = await uploadExerciseImage(image);
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
    console.error('Register exercise action failed:', error);

    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message: getActionErrorMessage(error, 'Could not create exercise. Please try again.'),
    };
  }
}

export async function deleteExerciseAction(id: number): Promise<ExerciseActionResult> {
  try {
    const user = await requireAuth();

    if (!Number.isSafeInteger(id) || id <= 0) {
      return {
        success: false,
        message: 'Invalid exercise ID.',
      };
    }

    const result = await exerciseService.delete(id, user.userId);

    return {
      success: true,
      message: result.message,
    };
  } catch (error: unknown) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function updateExerciseAction(id: number, formData: FormData): Promise<ExerciseActionResult> {
  let uploadedImageUrl: string | undefined;

  try {
    const user = await requireAuth();

    if (!Number.isSafeInteger(id) || id <= 0) {
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
      uploadedImageUrl = await uploadExerciseImage(image);
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
    console.error('Update exercise action failed:', error);

    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message: getActionErrorMessage(error, 'Something went wrong. Please try again.'),
    };
  }
}
