'use client';

import React, { createContext, useContext } from 'react';
import { useToast as useToastInternal } from '@/lib/hooks/use-toast';

const ToastContext = createContext<ReturnType<typeof useToastInternal> | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToastInternal();
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
