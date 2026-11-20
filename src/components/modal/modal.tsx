'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

import Button from '@/components/button/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div onClick={onClose} className="fixed inset-x-0 top-14 bottom-0 z-[60] flex items-center justify-center bg-black/70 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm lg:inset-0 lg:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-5rem-env(safe-area-inset-bottom))] min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-2xl lg:max-h-[85dvh]"
      >
        {/* Modal header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-5 sm:py-4">
          {title && (
            <h2 id="modal-title" className="min-w-0 text-base font-semibold tracking-tight text-zinc-100 sm:text-xl">
              {title}
            </h2>
          )}

          <Button variant="ghost" size="sm" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center !p-0" aria-label="Close modal">
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
