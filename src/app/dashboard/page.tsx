'use client';

import React, { useState } from 'react';
import { AlertModal } from '@/components/ui';

export default function DashboardPage() {
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'warning' | 'info' | 'error',
  });

  const showAlert = (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Portfolio Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Your portfolio value</p>
          <p className="text-3xl font-bold mt-2">$24,850.75</p>
          <div className="text-green-600 dark:text-green-400 mt-1">+5.32% (24h)</div>
        </div>
        
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Recent Trades</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>BTC/USDT</span>
              <span className="text-green-600 dark:text-green-400">Buy</span>
            </div>
            <div className="flex justify-between">
              <span>ETH/USDT</span>
              <span className="text-red-600 dark:text-red-400">Sell</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Account Status</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Verification Level</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Basic
            </span>
          </div>
          <button 
            onClick={() => showAlert('warning', 'Verification Required', 'Please complete the verification process to unlock full trading features.')}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Upgrade Now
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Market Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b dark:border-dark-100">
              <div className="flex items-center">
                <span className="font-medium">BTC</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Bitcoin</span>
              </div>
              <div>
                <div className="font-medium">$39,245.30</div>
                <div className="text-green-600 dark:text-green-400 text-sm">+2.4%</div>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-dark-100">
              <div className="flex items-center">
                <span className="font-medium">ETH</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Ethereum</span>
              </div>
              <div>
                <div className="font-medium">$2,318.75</div>
                <div className="text-green-600 dark:text-green-400 text-sm">+3.8%</div>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-dark-100">
              <div className="flex items-center">
                <span className="font-medium">SOL</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Solana</span>
              </div>
              <div>
                <div className="font-medium">$132.27</div>
                <div className="text-red-600 dark:text-red-400 text-sm">-1.2%</div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => showAlert('info', 'Market Information', 'Trading markets are currently active. Normal trading hours are 24/7.')}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            View All Markets
          </button>
        </div>
        
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Deposit Completed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">USDT 500.00 has been credited to your account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Trade Executed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">BTC/USDT buy order filled at $39,245.30</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => showAlert('success', 'New Feature Available', 'You can now track your trading performance with our new analytics dashboard.')}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            View All Activity
          </button>
        </div>
      </div>
      
      <AlertModal 
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
} 