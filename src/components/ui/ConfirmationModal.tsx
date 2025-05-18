'use client';

import React from 'react';
import Modal from './Modal';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'info' | 'danger';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}: ConfirmationModalProps) {
  const typeConfig = {
    warning: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    info: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-blue-500" />,
      buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
    danger: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
      buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-dark-200 mb-4">
          {typeConfig[type].icon}
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-3">
        <button
          type="button"
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`rounded-md px-4 py-2 text-sm font-medium text-white ${typeConfig[type].buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
} 