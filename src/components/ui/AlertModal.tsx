'use client';

import React from 'react';
import Modal from './Modal';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  buttonText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Got it',
}: AlertModalProps) {
  const typeConfig = {
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-300',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-300',
    },
    info: {
      icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-300',
    },
    error: {
      icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-300',
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
        <div className={`mt-3 text-center p-4 rounded-md ${typeConfig[type].bgColor}`}>
          <p className={`text-sm ${typeConfig[type].textColor}`}>
            {message}
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="rounded-md px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
} 