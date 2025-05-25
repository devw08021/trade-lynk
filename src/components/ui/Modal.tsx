"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  hideHeader?: boolean;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  hideHeader = false,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      ref={modalRef}
    >
      {/* Backdrop (click does NOT close) */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-transform duration-300 scale-100 ${className}`}
      >
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
            {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
