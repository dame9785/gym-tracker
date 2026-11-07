
'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-x-0 bottom-0 top-14 z-[60]
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
        p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]
        lg:inset-0 lg:z-[60] lg:p-6
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(e) => e.stopPropagation()}
        className="
          flex w-full max-w-5xl min-h-0 flex-col
          overflow-hidden rounded-2xl
          border border-zinc-700
          bg-zinc-900 shadow-2xl
          max-h-[calc(100dvh-5rem-env(safe-area-inset-bottom))]
          lg:max-h-[85dvh]
        "
      >
        {/* Modal header */}
        <div
          className="
            flex shrink-0 items-center justify-between gap-3
            border-b border-zinc-800
            px-4 py-3 sm:p-5
          "
        >
          {title && (
            <h2
              id="modal-title"
              className="min-w-0 text-lg font-bold sm:text-2xl"
            >
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-lg text-3xl leading-none
              text-zinc-400 transition
              hover:bg-zinc-800 hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-orange-400
            "
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="
            custom-scrollbar min-h-0 flex-1
            overflow-y-auto overscroll-contain
            p-3 sm:p-5
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
