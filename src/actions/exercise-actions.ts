'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import { registerExerciseSchema, updateExerciseSchema } from '@/schemas/exercise-schema';

import { put, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

const exerciseService = new ExerciseService();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function parseSecondaryMuscles(value: FormDataEntryValue | null): string[] {
  if (value === null || value === '') {
    return [];
  }

  if (typeof value !== 'string') {
    throw new Error('Invalid secondary muscle groups.');
  }

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed) || !parsed.every((muscle) => typeof muscle === 'string')) {
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

async function cleanupUploadedImage(url: string | undefined) {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN) {
    return;
  }

  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
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

export async function registerExerciseAction(formData: FormData) {
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

    const result = await exerciseService.registerExercise(
      {
        ...validation.data,
        ...(uploadedImageUrl ? { imagePath: uploadedImageUrl } : {}),
      },
      user.userId,
    );

    if (!result.success) {
      await cleanupUploadedImage(uploadedImageUrl);
    }

    return result;
  } catch (error) {
    console.error('Register exercise action failed:', error);

    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message:
        error instanceof Error && (error.message.startsWith('Only ') || error.message.startsWith('The image'))
          ? error.message
          : 'Could not create exercise. Please try again.',
    };
  }
}

export async function deleteExerciseAction(id: number) {
  try {
    const user = await requireAuth();

    if (!Number.isSafeInteger(id) || id <= 0) {
      return {
        success: false,
        message: 'Invalid exercise ID.',
      };
    }

    return await exerciseService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function updateExerciseAction(id: number, formData: FormData) {
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

    const result = await exerciseService.update(
      id,
      {
        ...validation.data,
        ...(uploadedImageUrl ? { imagePath: uploadedImageUrl } : {}),
      },
      user.userId,
    );

    if (!result.success) {
      await cleanupUploadedImage(uploadedImageUrl);
    }

    return result;
  } catch (error) {
    console.error('Update exercise action failed:', error);

    await cleanupUploadedImage(uploadedImageUrl);

    return {
      success: false,
      message:
        error instanceof Error && (error.message.startsWith('Only ') || error.message.startsWith('The image'))
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
}
