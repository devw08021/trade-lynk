
'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Button } from '@/components/ui/button';
import { ClipboardIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { updateUserProfile } from '@/store/slices/authSlice';

import { QRCodeComponent } from '@/components/ui/QRcode';
import { useToastContext } from '@/components/ui/ToastContext';

import { useGetTwoFactorMutation, useEnableTwoFactorMutation, useDisableTwoFactorMutation, useGetCurrentUserQuery } from '@/services/userService';

interface SetupData {
  qrCode: string;
  secret: string;
}

interface FormErrors {
  code?: string;
  password?: string;
}
interface FormState {
  code: string;
  step: 1 | 2 | 3;
  loading: boolean;
  copied: boolean;
  showCurrent: false,
}

export default function TwoFactorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { success, error: toastError } = useToastContext();
  const dispatch = useAppDispatch();



  const [twoFactor, { isLoading: isTwoFactorLoading }] = useGetTwoFactorMutation();
  const [enableTwoFactor, { isLoading: isEnableLoading }] = useEnableTwoFactorMutation();
  const [disableTwoFactor, { isLoading: isDisableLoading }] = useDisableTwoFactorMutation();
  const { isLoading, refetch: getCurrentUser } = useGetCurrentUserQuery();


  const { isTwoFactorEnabled } = useAppSelector(s => s.auth.user);
  console.log("🚀 ~ TwoFactorModal ~ isTwoFactorEnabled:", isTwoFactorEnabled)

  const [form, setForm] = useState<FormState>({
    code: '',
    step: isTwoFactorEnabled ? 2 : 1,
    loading: false,
    error: undefined,
    copied: false,
    showCurrent: false,
  });
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormErrors | 'form', string>>>({});


  // Fetch QR & secret when modal opens for setup
  useEffect(() => {
    if (isOpen && !isTwoFactorEnabled) {
      setForm(f => ({ ...f, loading: true, error: undefined, step: 1 }));
      twoFactor()
        .unwrap()
        .then(data => {
          console.log('2FA setup data:', data);
          setSetupData(data?.result || null);
          setForm(f => ({ ...f, loading: false }));
        })
        .catch(err => {
          toastError('Failed to fetch 2FA setup data');
          setForm(f => ({ ...f, loading: false, error: 'Failed to fetch setup data' }));
        });

    } else if (isTwoFactorEnabled) {
      setForm(f => ({ ...f, step: 2, loading: false, code: '', password: "" }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined, form: undefined }));
  };
  const handleCopy = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.secret);
      setForm(f => ({ ...f, copied: true }));
      success('Secret copied to clipboard');
      setTimeout(() => setForm(f => ({ ...f, copied: false })), 2000);
    }
  };

  const handleNext = async () => {


    setForm(f => ({ ...f, loading: true }));
    let data = {
      code: form.code,
      password: form.password,
      secret: setupData?.secret || '',
    };

    try {
      if (form.step === 1 && setupData) {
        const { success: apiStatus, result, message } = await enableTwoFactor(data).unwrap();
        if (apiStatus) {
          success(message);
          getUserDetails();
          setSetupData(null);
        }

        setForm(f => ({ ...f, step: 3, loading: false, code: '', password: '' }));
      } else if (form.step === 2) {
        const { success: apiStatus, result, message } = await disableTwoFactor(data).unwrap();
        if (apiStatus) {
          success(message);
          getUserDetails();
          onClose()
          setSetupData(null);
          setForm(f => ({ ...f, step: 1, loading: false, code: '', password: "" }));
        }
      } else {
        setForm(f => ({ ...f, error: 'Invalid code' }));
      }

    } catch (err) {
      console.error('Error during 2FA operation:', err);
      if (err && (err as any).data?.errors || {}) {
        setErrors({ ... (err as any).data?.errors?.fields || {} });
      } else {
        setErrors({ form: 'Failed to update password. Please try again.' });
      }
    } finally {
      setForm(f => ({ ...f, loading: false }));
    }
  };

  const getUserDetails = async () => {
    try {
      const { result } = await getCurrentUser().unwrap();
      dispatch(updateUserProfile(result));

    } catch (error) {
      console.error("🚀 ~ getUserDetails ~ error:", error)

    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTwoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Set Up Two-Factor Authentication'}
      size="md"
    >
      {form.step === 1 && setupData && (
        <>
          <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Scan this QR or copy the code below into your authenticator app.
            </p>
            <div className="flex justify-center">
              {/* <img src={setupData.qrCodeUrl} alt="2FA QR" className="w-48 h-48" /> */}
              <QRCodeComponent
                value={setupData.qrCodeUrl}
                size={256}
                level="M"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
            <div className="flex items-center">
              <code className="flex-1 bg-gray-100 dark:bg-dark-100 px-2 py-1 rounded font-mono text-sm break-all">
                {setupData.secret}
              </code>
              <Button variant="outline" size="icon" onClick={() => handleCopy()} className="ml-2">
                {form.copied ? <ShieldCheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter 6-digit code
            </label>
            <input
              type="text"
              value={form.code}
              autoComplete="password"
              name="code"
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10" placeholder="123456"
              placeholder="123456"
            />
            {errors.code && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.code}</p>}
          </div>
          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={form.showCurrent ? 'text' : 'password'}
                autoComplete="password"
                value={form.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setForm(f => ({ ...f, showCurrent: !f.showCurrent }))}
              >
                {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleNext} disabled={form.loading}>
              {form.loading ? <LoadingSpinner size="sm" /> : 'Verify & Enable'}
            </Button>
          </div>
        </>
      )}

      {form.step === 2 && (
        <>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Enter the 6-digit code from your authenticator app.
            </p>
            <div className="relative">
              <input
                type="text"
                value={form.code}
                onChange={handleChange}
                autoComplete='false'
                name="code"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10" placeholder="123456"
              />
              {errors.code && <p className="text-red-600 dark:text-red-400 text-sm">{errors.code}</p>}
            </div>
          </div>
          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={form.showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setForm(f => ({ ...f, showCurrent: !f.showCurrent }))}
              >
                {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="link" onClick={() => setForm(f => ({ ...f, code: '', error: undefined }))}>
              <ArrowPathIcon className="h-5 w-5 mr-1" /> Retry
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleNext} disabled={form.loading}>
                {form.loading ? <LoadingSpinner size="sm" /> : 'Verify'}
              </Button>
            </div>
          </div>

        </>
      )}

      {form.step === 3 && (
        <div className="text-center py-6">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Two-Factor Enabled!
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Your account is now protected. You’ll need a code when signing in.
          </p>
          <div className="mt-6">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}