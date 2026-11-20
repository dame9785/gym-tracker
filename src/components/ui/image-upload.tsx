'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FaCloudUploadAlt, FaImage, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

import Button from '@/components/button/button';

type ImageUploadProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  disabled?: boolean;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUpload({ file, onFileChange, currentImageUrl, currentImageAlt = 'Image', disabled = false }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

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

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const url = URL.createObjectURL(selectedFile);

    previewUrlRef.current = url;
    setPreviewUrl(url);

    onFileChange(selectedFile);
  };

  const handleRemoveImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl(null);
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayedImage = file ? previewUrl : currentImageUrl;

  return (
    <div className="w-full">
      <input ref={inputRef} className="hidden" id={inputId} name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} disabled={disabled} />

      {displayedImage ? (
        <div className="border-primary/40 bg-surface overflow-hidden rounded-xl border p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <FaImage />
              <span>{file ? 'New image selected' : 'Current image'}</span>
            </div>

            {file && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} disabled={disabled} ariaLabel="Remove selected image" className="text-text-muted hover:!bg-danger/10 hover:!text-danger !h-8 !w-8 !rounded-lg !p-0">
                <FaTimes />
              </Button>
            )}
          </div>

          <Image src={displayedImage} alt={file ? 'Preview of selected image' : currentImageAlt} width={1200} height={800} unoptimized className="max-h-64 w-full rounded-lg object-contain" />

          {file && <p className="text-text-secondary mt-3 truncate text-sm">{file.name}</p>}

          <Button type="button" variant="secondary" size="md" onClick={() => inputRef.current?.click()} disabled={disabled} className="!border-border !mt-3 !w-full !rounded-lg !border !px-4 !py-2 !text-sm !font-medium">
            {file || currentImageUrl ? 'Change image' : 'Choose image'}
          </Button>
        </div>
      ) : (
        <label htmlFor={inputId} className={`group border-border bg-surface/60 flex min-h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5 cursor-pointer'}`}>
          <span className="border-primary/30 bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl transition group-hover:scale-105">
            <FaCloudUploadAlt />
          </span>

          <span className="text-text group-hover:text-primary font-semibold transition">Click to upload an image</span>

          <span className="text-text-secondary mt-2 text-sm">Choose an image from your device</span>

          <span className="border-border text-text-secondary mt-4 rounded-lg border px-3 py-1.5 text-xs font-medium">JPEG · PNG · WebP</span>

          <span className="text-text-muted mt-2 text-xs">Maximum file size: 5 MB</span>
        </label>
      )}
    </div>
  );
}
