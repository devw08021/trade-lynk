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
    <div className="page-wrapper">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="heading-secondary text-gradient-muted mb-2">Trading Dashboard</h1>
          <p className="text-gradient-secondary">Monitor your funded trading account performance</p>
        </div>
        
        <div className="grid-responsive mb-8">
          <div className="card">
            <h2 className="text-lg font-medium mb-4 text-white">Account Balance</h2>
            <p className="text-gradient-secondary mb-2">Current account value</p>
            <p className="text-3xl font-light text-gradient-primary mb-2">$24,850.75</p>
            <div className="status-positive text-sm font-medium">+5.32% (24h)</div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-medium mb-4 text-white">Recent Trades</h2>
            <div className="space-y-3">
              <div className="flex-between">
                <span className="text-gradient-secondary">BTC/USDT</span>
                <span className="badge badge-success">Buy</span>
              </div>
              <div className="flex-between">
                <span className="text-gradient-secondary">ETH/USDT</span>
                <span className="badge badge-error">Sell</span>
              </div>
              <div className="flex-between">
                <span className="text-gradient-secondary">SOL/USDT</span>
                <span className="badge badge-success">Buy</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-medium mb-4 text-white">Challenge Status</h2>
            <div className="flex-between mb-4">
              <span className="text-gradient-secondary">Progress Level</span>
              <span className="badge badge-warning">Phase 1</span>
            </div>
            <div className="progress-bar mb-4">
              <div className="progress-fill" style={{width: '65%'}}></div>
            </div>
            <button 
              onClick={() => showAlert('warning', 'Challenge Progress', 'You are 65% through Phase 1. Maintain your performance to advance to Phase 2.')}
              className="btn-primary w-full"
            >
              View Challenge Details
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-medium mb-6 text-white">Market Overview</h2>
            <div className="space-y-4">
              <div className="flex-between pb-4 border-b border-[#2a2b2e]">
                <div className="flex items-center">
                  <span className="font-medium text-white">BTC</span>
                  <span className="ml-2 text-gradient-secondary">Bitcoin</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">$39,245.30</div>
                  <div className="status-positive text-sm">+2.4%</div>
                </div>
              </div>
              <div className="flex-between pb-4 border-b border-[#2a2b2e]">
                <div className="flex items-center">
                  <span className="font-medium text-white">ETH</span>
                  <span className="ml-2 text-gradient-secondary">Ethereum</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">$2,318.75</div>
                  <div className="status-positive text-sm">+3.8%</div>
                </div>
              </div>
              <div className="flex-between pb-4 border-b border-[#2a2b2e]">
                <div className="flex items-center">
                  <span className="font-medium text-white">SOL</span>
                  <span className="ml-2 text-gradient-secondary">Solana</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">$132.27</div>
                  <div className="status-negative text-sm">-1.2%</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => showAlert('info', 'Market Information', 'All major crypto markets are currently active. Trading is available 24/7.')}
              className="btn-ghost mt-6"
            >
              View All Markets
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-medium mb-6 text-white">Recent Activity</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 status-positive" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">Funding Approved</p>
                  <p className="text-xs text-gradient-secondary">$10,000 trading capital has been allocated to your account</p>
                  <p className="text-xs status-neutral mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#bfff00]/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">Trade Executed</p>
                  <p className="text-xs text-gradient-secondary">BTC/USDT buy order filled at $39,245.30</p>
                  <p className="text-xs status-neutral mt-1">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">Challenge Started</p>
                  <p className="text-xs text-gradient-secondary">Phase 1 evaluation period has begun</p>
                  <p className="text-xs status-neutral mt-1">1 day ago</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => showAlert('success', 'Performance Analytics', 'Your new analytics dashboard is now available with detailed performance metrics.')}
              className="btn-ghost mt-6"
            >
              View All Activity
            </button>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="mt-8">
          <h2 className="heading-tertiary text-gradient-muted mb-6">Trading Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">87.5%</div>
              <div className="text-sm text-gradient-secondary">Win Rate</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">1.85</div>
              <div className="text-sm text-gradient-secondary">Profit Factor</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">42</div>
              <div className="text-sm text-gradient-secondary">Total Trades</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">12d</div>
              <div className="text-sm text-gradient-secondary">Days Active</div>
            </div>
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
    </div>
  );
}
