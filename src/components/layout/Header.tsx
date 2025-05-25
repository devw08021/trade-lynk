'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAppSelector } from '@/store/store';
import UserMenu from '@/components/ui/UserMenu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Spot', href: '/spot' },
  { name: 'Futures', href: '/perpetual' },
  { name: 'P2P', href: '/p2p' },
  { name: 'Wallet', href: '/wallet' },
  { name: 'Markets', href: '/markets' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration before rendering
  if (!mounted) return null;

  return (
    <header className="bg-white dark:bg-dark-300 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                CryptoTrade
              </span>
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center gap-x-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-200"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  pathname === item.href
                    ? 'text-primary-600 bg-gray-50 dark:text-primary-400 dark:bg-dark-200'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-200'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-dark-100">
                <div className="grid grid-cols-2 gap-4 px-3 mt-4">
                  <Link
                    href="/auth/login"
                    className="text-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-100 hover:bg-gray-50 dark:hover:bg-dark-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
