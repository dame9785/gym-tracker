// --------------------------------------------------
// Get image file
// --------------------------------------------------

export function getImageFile(image: File | null | undefined): File | null {
  if (!image) {
    return null;
  }

  if (!(image instanceof File)) {
    throw new Error('Invalid image file.');
  }

  return image.size > 0 ? image : null;
}
