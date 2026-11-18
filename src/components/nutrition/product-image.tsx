import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

// --------------------------------------------------
// Types
// --------------------------------------------------

type ProductImageProps = {
  imageUrl: string | null | undefined;
  name: string;
  size?: 'small' | 'large';
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function ProductImage({ imageUrl, name, size = 'small' }: ProductImageProps) {
  const isLarge = size === 'large';

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-800 ${isLarge ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-16 w-16'}`}>
      {imageUrl ? <Image src={imageUrl} alt={name} fill sizes={isLarge ? '112px' : '64px'} className="object-cover" /> : <ImageIcon size={isLarge ? 32 : 24} className="text-zinc-600" />}
    </div>
  );
}
