'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FaCloudUploadAlt, FaImage, FaTimes } from 'react-icons/fa';

type ImageUploadProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  disabled?: boolean;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUpload({ file, onFileChange, currentImageUrl, currentImageAlt = 'Exercise image', disabled = false }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      toast.error('Only JPEG, PNG and WebP images are allowed.');
      event.target.value = '';
      onFileChange(null);
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast.error('The image must be 5 MB or smaller.');
      event.target.value = '';
      onFileChange(null);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemoveImage = () => {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayedImage = previewUrl || currentImageUrl;

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        className="hidden"
        id={inputId}
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
        disabled={disabled}
      />

      {displayedImage ? (
        <div className="overflow-hidden rounded-xl border border-orange-500/40 bg-zinc-900 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-400">
              <FaImage />
              <span>{file ? 'New image selected' : 'Current image'}</span>
            </div>

            {file && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                aria-label="Remove selected image"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <img src={displayedImage} alt={file ? 'Preview of selected image' : currentImageAlt} className="max-h-64 w-full rounded-lg object-contain" />

          {file && <p className="mt-3 truncate text-sm text-zinc-300">{file.name}</p>}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="mt-3 w-full rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-orange-500 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {file || currentImageUrl ? 'Change image' : 'Choose image'}
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`group flex min-h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/60 p-6 text-center transition ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-orange-500 hover:bg-orange-500/5'
          }`}
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-2xl text-orange-400 transition group-hover:scale-105 group-hover:bg-orange-500/20">
            <FaCloudUploadAlt />
          </span>

          <span className="font-semibold text-zinc-100 transition group-hover:text-orange-400">Click to upload an image</span>

          <span className="mt-2 text-sm text-zinc-400">Choose an image from your device</span>

          <span className="mt-4 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300">JPEG · PNG · WebP</span>

          <span className="mt-2 text-xs text-zinc-500">Maximum file size: 5 MB</span>
        </label>
      )}
    </div>
  );
}
