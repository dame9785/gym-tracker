'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import { registerExerciseSchema, RegisterExericseDto, updateExerciseSchema } from '@/schemas/exercise-schema';

import { put, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

const exerciseService = new ExerciseService();

export async function registerExerciseAction(formData: FormData) {
  let uploadedImageUrl: string | undefined;

  try {
    const user = await requireAuth();

    const dto = {
      name: String(formData.get('name') ?? ''),
      muscleGroup: String(formData.get('muscleGroup') ?? ''),
      equipment: String(formData.get('equipment') ?? ''),
    };

    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const image = formData.get('image');

    if (image !== null && !(image instanceof File)) {
      return {
        success: false,
        message: 'Invalid image file.',
      };
    }

    if (image instanceof File && image.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'The image must be 5 MB or smaller.',
      };
    }

    if (image instanceof File && !['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
      return {
        success: false,
        message: 'Only JPEG, PNG and WebP images are allowed.',
      };
    }

    let imagePath: string | undefined;

    if (image instanceof File && image.size > 0) {
      const token = process.env.BLOB_READ_WRITE_TOKEN;

      if (!token) {
        throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');
      }

      const extensionByType: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      };

      const blob = await put(`exercises/${randomUUID()}.${extensionByType[image.type]}`, image, {
        access: 'public',
        token,
        contentType: image.type,
      });

      uploadedImageUrl = blob.url;
      imagePath = blob.url;
    }

    const result = await exerciseService.registerExercise(
      {
        ...validation.data,
        ...(imagePath ? { imagePath } : {}),
      },
      user.userId,
    );

    if (!result.success && uploadedImageUrl) {
      await del(uploadedImageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    return result;
  } catch (error) {
    console.error('Register exercise action failed:', error);

    if (uploadedImageUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(uploadedImageUrl, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded image:', cleanupError);
      }
    }

    return {
      success: false,
      message: 'Could not create exercise. Please try again.',
    };
  }
}

export async function deleteExerciseAction(id: number) {
  try {
    const user = await requireAuth();

    return await exerciseService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// UPDATE
export async function updateExerciseAction(id: number, formData: FormData) {
  let uploadedImageUrl: string | null = null;

  try {
    const user = await requireAuth();

    const dto = {
      name: formData.get('name'),
      muscleGroup: formData.get('muscleGroup'),
      equipment: formData.get('equipment'),
    };

    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const image = formData.get('image');

    let imagePath: string | undefined;

    if (image instanceof File && image.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(image.type)) {
        return {
          success: false,
          message: 'Only JPG, PNG and WebP images are allowed.',
        };
      }

      if (image.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: 'The image must not exceed 5 MB.',
        };
      }

      const { put } = await import('@vercel/blob');
      const { randomUUID } = await import('node:crypto');

      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[image.type];

      const blob = await put(`exercises/${randomUUID()}.${extension}`, image, {
        access: 'public',
        contentType: image.type,
      });

      uploadedImageUrl = blob.url;
      imagePath = blob.url;
    }

    const result = await exerciseService.update(
      id,
      {
        ...validation.data,
        ...(imagePath ? { imagePath } : {}),
      },
      user.userId,
    );

    if (!result.success && uploadedImageUrl) {
      const { del } = await import('@vercel/blob');
      await del(uploadedImageUrl);
    }

    return result;
  } catch (error) {
    console.error('Update exercise action failed:', error);

    if (uploadedImageUrl) {
      try {
        const { del } = await import('@vercel/blob');
        await del(uploadedImageUrl);
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded image:', cleanupError);
      }
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
