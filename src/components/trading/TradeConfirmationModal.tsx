'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface TradeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tradeType: 'buy' | 'sell';
  coinPair: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  isLoading?: boolean;
}

export default function TradeConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  tradeType,
  coinPair,
  amount,
  price,
  total,
  fee,
  isLoading = false,
}: TradeConfirmationModalProps) {
  const [baseCoin, quoteCoin] = coinPair.split('/');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${tradeType === 'buy' ? 'Buy' : 'Sell'} Order`}
      size="md"
    >
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${
            tradeType === 'buy' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {tradeType === 'buy' 
              ? <ArrowDownIcon className="h-8 w-8" /> 
              : <ArrowUpIcon className="h-8 w-8" />
            }
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Type</span>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {tradeType} {tradeType === 'buy' ? baseCoin : quoteCoin}
              </p>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Pair</span>
              <p className="font-medium text-gray-900 dark:text-white">{coinPair}</p>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <p className="font-medium text-gray-900 dark:text-white">{amount} {baseCoin}</p>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Price</span>
              <p className="font-medium text-gray-900 dark:text-white">{price} {quoteCoin}</p>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Fee</span>
              <p className="font-medium text-gray-900 dark:text-white">{fee} {quoteCoin}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Total</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {total} {quoteCoin}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            *The final amount may vary slightly due to price fluctuations
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              tradeType === 'buy' 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </div>
            ) : (
              `Confirm ${tradeType === 'buy' ? 'Purchase' : 'Sale'}`
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 