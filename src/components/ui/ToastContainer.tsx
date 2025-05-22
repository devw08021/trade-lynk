'use client';

import React from 'react';
import { useToastContext } from '@/components/ui/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastContext(); // ✅ uses context now

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded shadow-md text-white ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : toast.type === 'warning'
              ? 'bg-yellow-600 text-black'
              : 'bg-blue-600'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
