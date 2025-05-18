'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { QrCodeIcon, ClipboardIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

export interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: (code: string) => Promise<void>;
  onVerify: (code: string) => Promise<boolean>;
  setupData?: {
    qrCode: string;
    secret: string;
  };
  isAlreadySetup?: boolean;
}

export default function TwoFactorModal({
  isOpen,
  onClose,
  onSetup,
  onVerify,
  setupData,
  isAlreadySetup = false,
}: TwoFactorModalProps) {
  const [currentStep, setCurrentStep] = useState(isAlreadySetup ? 2 : 1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(value);
    if (error) setError('');
  };

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSetupComplete = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSetup(verificationCode);
      setCurrentStep(3);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onVerify(verificationCode);
      if (success) {
        onClose();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAlreadySetup ? "Two-Factor Authentication" : "Set Up Two-Factor Authentication"}
      size="md"
    >
      {currentStep === 1 && setupData && (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Two-factor authentication adds an extra layer of security to your account. Each time you sign in, you'll need to provide a code from your authentication app.
            </p>
            
            <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Step 1: Scan the QR code</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Use an authenticator app like Google Authenticator or Authy to scan this QR code.
            </p>
            
            <div className="flex justify-center my-6 bg-white p-4 rounded">
              <img src={setupData.qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
            </div>
            
            <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Step 2: Or enter this code manually</h3>
            <div className="flex items-center mt-2 mb-4">
              <div className="bg-gray-100 dark:bg-dark-100 p-2 rounded flex-1 font-mono text-sm break-all">
                {setupData.secret}
              </div>
              <button
                type="button"
                onClick={handleCopySecret}
                className="ml-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-100 focus:outline-none"
              >
                {isCopied ? (
                  <div className="text-green-600 dark:text-green-400 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-1" />
                    <span className="text-xs">Copied</span>
                  </div>
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Step 3: Verify Setup</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Enter the 6-digit code from your authentication app to verify and complete the setup.
            </p>
            
            <div className="mt-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                6-digit verification code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="verificationCode"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-100 dark:bg-dark-200 dark:text-white rounded-md ${
                    error ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="123456"
                  autoComplete="off"
                />
                {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              onClick={handleSetupComplete}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Verifying...
                </div>
              ) : (
                'Verify and Enable'
              )}
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Enter the 6-digit code from your authentication app to verify your identity.
            </p>
            
            <div className="mt-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                6-digit verification code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="verificationCode"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-100 dark:bg-dark-200 dark:text-white rounded-md ${
                    error ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="123456"
                  autoComplete="off"
                />
                {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setVerificationCode('');
                  setError('');
                }}
                className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <ArrowPathIcon className="mr-1 h-4 w-4" />
                Clear and try again
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Verifying...
                </div>
              ) : (
                'Verify'
              )}
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="flex flex-col items-center py-6">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Two-Factor Authentication Enabled
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center max-w-md mb-4">
            Your account is now protected with two-factor authentication. You'll need to enter a verification code each time you sign in.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md w-full mb-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 text-sm mb-2">Important</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-200">
              Save your backup codes in a safe place. If you lose access to your authentication device, you'll need these codes to regain access to your account.
            </p>
          </div>
          
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
} 