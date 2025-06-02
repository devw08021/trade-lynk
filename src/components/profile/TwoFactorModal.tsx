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
  qrCodeUrl?: string;
}

interface FormErrors {
  code?: string;
  password?: string;
}

interface FormState {
  code: string;
  password: string;
  step: 1 | 2 | 3;
  loading: boolean;
  copied: boolean;
  showCurrent: boolean;
  error?: string;
}

export default function TwoFactorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { success, error: toastError } = useToastContext();
  const dispatch = useAppDispatch();

  const [twoFactor, { isLoading: isTwoFactorLoading }] = useGetTwoFactorMutation();
  const [enableTwoFactor, { isLoading: isEnableLoading }] = useEnableTwoFactorMutation();
  const [disableTwoFactor, { isLoading: isDisableLoading }] = useDisableTwoFactorMutation();
  const { isLoading, refetch: getCurrentUser } = useGetCurrentUserQuery();

  const { isTwoFactorEnabled } = useAppSelector(s => s.auth.user);

  const [form, setForm] = useState<FormState>({
    code: '',
    password: '',
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
  }, [isOpen, isTwoFactorEnabled, twoFactor, toastError]);

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
        setErrors({ form: 'Operation failed. Please try again.' });
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
      console.error("Error fetching user details:", error)
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTwoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Set Up Two-Factor Authentication'}
      size="md"
    >
      {/* Setup Step */}
      {form.step === 1 && setupData && (
        <div className="space-y-6">
          {/* General Error */}
          {errors.form && (
            <div className="alert-error">
              <p className="text-sm">{errors.form}</p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="card-dark space-y-4">
            <p className="text-sm text-gradient-secondary">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) or manually enter the secret key.
            </p>
            
            <div className="flex-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeComponent
                  value={setupData.qrCodeUrl || setupData.secret}
                  size={200}
                  level="M"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-[#08090a] px-3 py-2 rounded font-mono text-sm text-brand break-all border border-[#2a2b2e]">
                {setupData.secret}
              </div>
              <button
                onClick={handleCopy}
                className="btn-outline p-2"
                title="Copy to clipboard"
              >
                {form.copied ? 
                  <ShieldCheckIcon className="h-5 w-5 text-success" /> : 
                  <ClipboardIcon className="h-5 w-5" />
                }
              </button>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Enter 6-digit verification code
            </label>
            <input
              type="text"
              value={form.code}
              name="code"
              onChange={handleChange}
              className={`form-input text-center text-lg tracking-widest ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="123456"
              maxLength={6}
            />
            {errors.code && <p className="text-error text-sm mt-1">{errors.code}</p>}
          </div>

          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Current Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={form.showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your current password"
                className={`form-input pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                onClick={() => setForm(f => ({ ...f, showCurrent: !f.showCurrent }))}
              >
                {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-error">{errors.password}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button onClick={onClose} className="btn-outline" disabled={form.loading}>
              Cancel
            </button>
            <button 
              onClick={handleNext} 
              disabled={form.loading || !form.code || !form.password}
              className={`btn-primary ${(form.loading || !form.code || !form.password) ? 'btn-disabled' : ''}`}
            >
              {form.loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner mr-2"></div>
                  Enabling...
                </div>
              ) : (
                'Verify & Enable'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Disable Step */}
      {form.step === 2 && (
        <div className="space-y-6">
          {/* General Error */}
          {errors.form && (
            <div className="alert-error">
              <p className="text-sm">{errors.form}</p>
            </div>
          )}

          <div className="alert-warning">
            <p className="text-sm">
              <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure. 
              Enter your verification code and password to proceed.
            </p>
          </div>

          {/* Verification Code */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Enter 6-digit code from your authenticator app
            </label>
            <input
              type="text"
              value={form.code}
              onChange={handleChange}
              name="code"
              className={`form-input text-center text-lg tracking-widest ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="123456"
              maxLength={6}
            />
            {errors.code && <p className="text-error text-sm mt-1">{errors.code}</p>}
          </div>

          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Current Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={form.showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your current password"
                className={`form-input pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                onClick={() => setForm(f => ({ ...f, showCurrent: !f.showCurrent }))}
              >
                {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-error">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={() => setForm(f => ({ ...f, code: '', error: undefined }))}
              className="btn-ghost flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" /> 
              Clear Code
            </button>
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn-outline" disabled={form.loading}>
                Cancel
              </button>
              <button 
                onClick={handleNext} 
                disabled={form.loading || !form.code || !form.password}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors ${(form.loading || !form.code || !form.password) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {form.loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Disabling...
                  </div>
                ) : (
                  'Disable 2FA'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Step */}
      {form.step === 3 && (
        <div className="text-center py-8">
          <div className="flex-center mb-6">
            <div className="icon-container">
              <ShieldCheckIcon className="h-8 w-8 text-black" />
            </div>
          </div>
          <h3 className="heading-tertiary text-gradient-muted mb-3">
            Two-Factor Authentication Enabled!
          </h3>
          <p className="text-gradient-secondary mb-6">
            Your account is now protected with an additional layer of security. You'll need to enter a verification code from your authenticator app each time you sign in.
          </p>
          
          <div className="card-dark mb-6">
            <h4 className="font-medium text-brand mb-3">Important Security Tips:</h4>
            <ul className="text-sm text-gradient-secondary space-y-2 text-left">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-brand rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Save your backup codes in a secure location</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-brand rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Keep your authenticator app updated</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-brand rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Don't share your verification codes with anyone</span>
              </li>
            </ul>
          </div>
          
          <button onClick={onClose} className="btn-primary-large">
            Complete Setup
          </button>
        </div>
      )}
    </Modal>
  );
}
