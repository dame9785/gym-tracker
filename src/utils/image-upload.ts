import { put, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const EXTENSION_BY_TYPE: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const IMAGE_SIGNATURES = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
} as const;

// --------------------------------------------------
// Validation
// --------------------------------------------------

function validateImage(image: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error('Only JPEG, PNG and WebP images are allowed.');
  }

  if (image.size === 0 || image.size > MAX_IMAGE_SIZE) {
    throw new Error('The image must be 5 MB or smaller.');
  }
}

function validateFolder(folder: string): void {
  if (!/^[a-zA-Z0-9_-]+$/.test(folder)) {
    throw new Error('Invalid image folder.');
  }
}

async function validateImageContent(image: File): Promise<void> {
  const signature = IMAGE_SIGNATURES[image.type as keyof typeof IMAGE_SIGNATURES];

  const header = new Uint8Array(await image.slice(0, signature.length).arrayBuffer());

  const matches = signature.every((byte, index) => header[index] === byte);

  if (!matches) {
    throw new Error('Invalid image file.');
  }
}

// --------------------------------------------------
// Upload image
// --------------------------------------------------

export async function uploadImage(image: File, folder: string): Promise<string> {
  validateImage(image);
  validateFolder(folder);
  await validateImageContent(image);

  const extension = EXTENSION_BY_TYPE[image.type as keyof typeof EXTENSION_BY_TYPE];

  const blob = await put(`${folder}/${randomUUID()}.${extension}`, image, {
    access: 'public',
    contentType: image.type,
  });

  return blob.url;
}

// --------------------------------------------------
// Cleanup uploaded image
// --------------------------------------------------

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
