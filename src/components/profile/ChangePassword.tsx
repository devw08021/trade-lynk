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
        success('Profile updated successfully');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" size="md">
      <div className="space-y-4">
        {/* Field Errors */}
        {errors.form && (
          <div className="text-sm text-red-600 dark:text-red-400">{errors.form}</div>
        )}

        {/* Current Password */}
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CURRENT PASSWORD
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={form.showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => toggleVisibility('showCurrent')}
            >
              {form.showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={form.showNew ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => toggleVisibility('showNew')}
            >
              {form.showNew ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={form.showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => toggleVisibility('showConfirm')}
            >
              {form.showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={form.loader}>
          {form.loader ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />Updating...
            </div>
          ) : (
            'Change Password'
          )}
        </Button>
      </div>
    </Modal>
  );
}
