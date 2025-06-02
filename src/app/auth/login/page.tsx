'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/services/userService';
import { useAppDispatch } from '@/store/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { useToastContext } from '@/components/ui/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error } = useToastContext();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const { success: apiStatus, result, message } = await login({ email, password }).unwrap();
      if (message)
        success(`${message}`);
      dispatch(loginSuccess(result));
      router.push('/profile');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err && (err as any).data?.errors || {}) {
        setErrors({ ... (err as any).data?.errors?.fields || {} });
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="page-wrapper flex-center section-padding">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="nav-logo justify-center mb-6">
              <div className="nav-logo-icon">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="nav-logo-text">SPF</span>
            </div>
            <h2 className="heading-tertiary text-gradient-muted mb-2">
              Sign in to your account
            </h2>
            <p className="text-gradient-secondary">
              Or{' '}
              <Link href="/auth/register" className="text-brand hover:text-[#a6e600] font-medium transition-colors">
                create a new account
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="alert-error mb-6">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-error">
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-error">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand focus:ring-brand border-[#2a2b2e] rounded bg-[#1a1b1e]"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gradient-secondary">
                  Remember me
                </label>
                {errors.rememberMe && (
                  <p className="ml-2 text-sm text-error">
                    {errors.rememberMe}
                  </p>
                )}
              </div>

              <Link href="/auth/forgot-password" className="text-sm text-brand hover:text-[#a6e600] font-medium transition-colors">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary-large w-full ${isLoading ? 'btn-disabled' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2b2e]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1b1e] text-gradient-secondary">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex justify-center items-center py-3 px-4 border border-[#2a2b2e] rounded-md bg-[#1a1b1e] text-sm font-medium text-gradient-secondary hover:bg-[#2a2b2e] transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                type="button"
                className="flex justify-center items-center py-3 px-4 border border-[#2a2b2e] rounded-md bg-[#1a1b1e] text-sm font-medium text-gradient-secondary hover:bg-[#2a2b2e] transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
