'use client';

import React from 'react';
import Modal from './Modal';

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export default function TermsModal({
  isOpen,
  onClose,
  type = 'terms',
}: TermsModalProps) {
  const content = {
    terms: {
      title: 'Terms of Service',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          content: 'By accessing or using our trading platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
        },
        {
          heading: '2. Trading Risks',
          content: 'Trading cryptocurrencies involves significant risk. You acknowledge that you are trading at your own risk and that you may lose your entire investment. We are not responsible for any losses you may incur while using our platform.'
        },
        {
          heading: '3. Account Registration',
          content: 'To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.'
        },
        {
          heading: '4. User Responsibilities',
          content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.'
        },
        {
          heading: '5. Modifications to Service',
          content: 'We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          heading: '1. Information Collection',
          content: 'We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, or otherwise contact us.'
        },
        {
          heading: '2. Use of Information',
          content: 'We use personal information collected via our platform for a variety of business purposes including to provide and maintain our service, process transactions, send you marketing communications, and respond to inquiries.'
        },
        {
          heading: '3. Information Sharing',
          content: 'We may share your information with third-party service providers to help us operate our business, conduct KYC/AML procedures, or administer activities on our behalf.'
        },
        {
          heading: '4. Data Security',
          content: 'We have implemented appropriate security measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.'
        },
        {
          heading: '5. Your Rights',
          content: 'You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update, or request deletion of your personal information directly within your account settings.'
        }
      ]
    }
  };

  const selectedContent = content[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedContent.title}
      size="lg"
    >
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {selectedContent.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {section.heading}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {section.content}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-md px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={onClose}
        >
          I Understand
        </button>
      </div>
    </Modal>
  );
} 