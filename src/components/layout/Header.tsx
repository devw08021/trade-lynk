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
    <header className="relative z-10">
      <nav className="nav-bar" aria-label="Global">
        {/* Logo & Desktop Nav */}
        <div className="nav-logo">
          <Link href="/" className="flex items-center gap-3">
            <div className="nav-logo-icon">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="nav-logo-text">SPF</span>
          </Link>
        </div>

        <ul className="nav-menu">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`nav-link ${
                  pathname === item.href ? 'text-brand' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="desktop-menu items-center gap-x-2">
              <Link href="/auth/login" className="btn-ghost-small">
                Log In
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="mobile-menu inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white transition-colors focus:outline-none"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu absolute top-full left-0 right-0 bg-[#0a0a0b] border-t border-[#2a2b2e] py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-6 py-3 text-base font-light transition-colors ${
                  pathname === item.href
                    ? 'text-brand bg-[#1a1b1e]'
                    : 'text-gray-300 hover:text-brand hover:bg-[#1a1b1e]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-[#2a2b2e] mx-6">
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    href="/auth/login"
                    className="btn-outline w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
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
