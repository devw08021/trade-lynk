"use client";

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUpdatePasswordMutation } from '@/services/userService';
import { useToastContext } from '@/components/ui/ToastContext';

export interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  loader: boolean;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordProps) {
  const [updatePassword] = useUpdatePasswordMutation();
  const { success, error } = useToastContext();

  const [form, setForm] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
    loader: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData | 'form', string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const toggleVisibility = (field: 'showCurrent' | 'showNew' | 'showConfirm') => {
    setForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;
    const newErrors: typeof errors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required.';
    if (!newPassword) newErrors.newPassword = 'New password is required.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password.';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (newPassword && newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long.';
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setForm(prev => ({ ...prev, loader: true }));
    try {
      const data = {
        currentPassword,
        newPassword,
        confirmPassword
      };
      const { success: apiStatus, result, message } = await updatePassword(data).unwrap();
      if (apiStatus) {
        success('Password updated successfully');
        onClose();
      }
      if (message) {
        success(message);
      }
      onClose();
    } catch (err) {
      if (err && (err as any).data?.errors || {}) {
        setErrors({ ... (err as any).data?.errors?.fields || {} });
      } else {
        setErrors({ form: 'Failed to update password. Please try again.' });
      }
    } finally {
      setForm(prev => ({ ...prev, loader: false }));
    }
  };

  // Reset form and errors when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrent: false,
        showNew: false,
        showConfirm: false,
        loader: false,
      });
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" size="md">
      <div className="space-y-6">
        {/* General Error */}
        {errors.form && (
          <div className="alert-error">
            <p className="text-sm">{errors.form}</p>
          </div>
        )}

        {/* Current Password */}
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-white">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={form.showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              className={`form-input pr-12 ${errors.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              onClick={() => toggleVisibility('showCurrent')}
            >
              {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-2 text-sm text-error">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-white">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={form.showNew ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              className={`form-input pr-12 ${errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              onClick={() => toggleVisibility('showNew')}
            >
              {form.showNew ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-2 text-sm text-error">{errors.newPassword}</p>
          )}
          <div className="text-xs text-gradient-secondary">
            Password must be at least 8 characters long
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={form.showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className={`form-input pr-12 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              onClick={() => toggleVisibility('showConfirm')}
            >
              {form.showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {form.newPassword && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-white">Password Strength</div>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className={`w-2 h-2 rounded-full mr-2 ${form.newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span className={form.newPassword.length >= 8 ? 'text-success' : 'text-gradient-secondary'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center text-xs">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(form.newPassword) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span className={/[A-Z]/.test(form.newPassword) ? 'text-success' : 'text-gradient-secondary'}>
                  Contains uppercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(form.newPassword) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span className={/[0-9]/.test(form.newPassword) ? 'text-success' : 'text-gradient-secondary'}>
                  Contains number
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="alert-info">
          <p className="text-sm">
            <strong>Security Notice:</strong> Choose a strong password that you haven't used elsewhere. 
            You'll need to log in again after changing your password.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={onClose}
          className="btn-outline"
          disabled={form.loader}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={form.loader}
          className={`btn-primary ${form.loader ? 'btn-disabled' : ''}`}
        >
          {form.loader ? (
            <div className="flex items-center">
              <div className="loading-spinner mr-2"></div>
              Updating...
            </div>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
    </Modal>
  );
}
