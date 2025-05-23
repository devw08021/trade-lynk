import '@/globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/ToastContext';
import ToastContainer from '@/components/ui/ToastContainer';
import PageTracker from '@/components/layout/PageTracker';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextGen Trading Platform',
  description: 'Advanced trading platform for spot, perpetual, and P2P trading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            <PageTracker />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-400">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <ToastContainer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
} 