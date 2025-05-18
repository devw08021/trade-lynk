'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

export interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  verificationLevel: 'basic' | 'advanced' | 'completed';
}

export default function KYCModal({
  isOpen,
  onClose,
  onSubmit,
  verificationLevel = 'basic',
}: KYCModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    idFront: File | null;
    idBack: File | null;
    selfie: File | null;
  }>({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setUploadedFiles({
        ...uploadedFiles,
        [name]: files[0],
      });
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const submissionData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value);
      });
      
      if (uploadedFiles.idFront) {
        submissionData.append('idFront', uploadedFiles.idFront);
      }
      if (uploadedFiles.idBack) {
        submissionData.append('idBack', uploadedFiles.idBack);
      }
      if (uploadedFiles.selfie) {
        submissionData.append('selfie', uploadedFiles.selfie);
      }
      
      await onSubmit(submissionData);
      
      setCurrentStep(4);
    } catch (error) {
      console.error('KYC submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showAdvancedVerification = verificationLevel === 'advanced' || verificationLevel === 'completed';
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Identity Verification"
      size="lg"
    >
      {verificationLevel === 'completed' ? (
        <div className="flex flex-col items-center py-6">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Verification Complete
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
            Your identity has been successfully verified. You now have full access to all trading features.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
          >
            Continue Trading
          </button>
        </div>
      ) : (
        <div>
          <div className="border-b border-gray-200 dark:border-dark-100 pb-4 mb-6">
            <div className="flex justify-between relative">
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-dark-100 text-gray-700 dark:text-gray-400'
                }`}>
                  1
                </div>
                <span className="text-xs mt-1">Basic Info</span>
              </div>
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-dark-100 text-gray-700 dark:text-gray-400'
                }`}>
                  2
                </div>
                <span className="text-xs mt-1">Document</span>
              </div>
              {showAdvancedVerification && (
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 dark:bg-dark-100 text-gray-700 dark:text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className="text-xs mt-1">Address</span>
                </div>
              )}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 4 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-dark-100 text-gray-700 dark:text-gray-400'
                }`}>
                  {showAdvancedVerification ? '4' : '3'}
                </div>
                <span className="text-xs mt-1">Complete</span>
              </div>
              
              <div className="absolute top-4 h-0.5 bg-gray-200 dark:bg-dark-100 left-0 right-0 -translate-y-1/2 z-0">
                <div 
                  className="h-0.5 bg-primary-600 transition-all"
                  style={{ 
                    width: showAdvancedVerification 
                      ? `${((currentStep - 1) / 3) * 100}%` 
                      : `${((currentStep - 1) / 2) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country of Residence
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>   
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Identity Document</h3>
                
                <div>
                  <label htmlFor="idType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Document Type
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                  >
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                    <option value="idCard">National ID Card</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Front Side of Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-100 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {uploadedFiles.idFront ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            {uploadedFiles.idFront.name}
                          </span>
                          <span className="pl-1">({Math.round(uploadedFiles.idFront.size / 1024)} KB)</span>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="idFront" className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="idFront" name="idFront" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Back Side of Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-100 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {uploadedFiles.idBack ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            {uploadedFiles.idBack.name}
                          </span>
                          <span className="pl-1">({Math.round(uploadedFiles.idBack.size / 1024)} KB)</span>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="idBack" className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="idBack" name="idBack" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selfie with Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-100 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {uploadedFiles.selfie ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            {uploadedFiles.selfie.name}
                          </span>
                          <span className="pl-1">({Math.round(uploadedFiles.selfie.size / 1024)} KB)</span>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="selfie" className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="selfie" name="selfie" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && showAdvancedVerification && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Verification</h3>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Please note: You will need to provide proof of address such as a utility bill or bank statement dated within the last 3 months.
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === (showAdvancedVerification ? 4 : 3) && (
              <div className="flex flex-col items-center py-6">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Verification Submitted
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                  Thank you for submitting your verification details. Our team will review your information and documents. This usually takes 1-3 business days.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Return to Trading
                </button>
              </div>
            )}
            
            <div className="mt-8 flex justify-between border-t border-gray-200 dark:border-dark-100 pt-4">
              {currentStep > 1 && currentStep < (showAdvancedVerification ? 4 : 3) && (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handlePrevStep}
                >
                  Back
                </button>
              )}
              
              {currentStep < (showAdvancedVerification ? 4 : 3) && (
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    currentStep === 1 ? 'ml-auto' : ''
                  }`}
                  onClick={currentStep === (showAdvancedVerification ? 3 : 2) ? handleSubmit : handleNextStep}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </div>
                  ) : currentStep === (showAdvancedVerification ? 3 : 2) ? (
                    'Submit Verification'
                  ) : (
                    'Next'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
} 