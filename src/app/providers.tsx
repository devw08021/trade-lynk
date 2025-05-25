'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store,persistor } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react'


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
} 