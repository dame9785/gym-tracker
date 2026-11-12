import { put, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function uploadImage(image: File, folder: string): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    throw new Error('Only JPEG, PNG and WebP images are allowed.');
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error('The image must be 5 MB or smaller.');
  }

  const extension = EXTENSION_BY_TYPE[image.type];

  const blob = await put(`${folder}/${randomUUID()}.${extension}`, image, {
    access: 'public',
    contentType: image.type,
  });

  return blob.url;
}

export async function cleanupUploadedImage(url: string | undefined): Promise<void> {
  if (!url) {
    return;
  }

  try {
    await del(url);
  } catch (error: unknown) {
    console.error('Failed to clean up uploaded image:', error);
  }
}
