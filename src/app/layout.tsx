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
  title: 'SPF Trading Platform',
  description: 'Your reliable partner to risk-free funding - Advanced prop firm trading platform',
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
            <div className="page-wrapper flex flex-col">
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
