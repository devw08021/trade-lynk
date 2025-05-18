'use client';

import React from 'react';

interface P2PFiltersProps {
  availableAssets: string[];
  availableFiatCurrencies: string[];
  paymentMethods: string[];
  selectedAsset: string;
  selectedFiatCurrency: string;
  selectedPaymentMethod: string | null;
  onAssetChange: (asset: string) => void;
  onFiatCurrencyChange: (currency: string) => void;
  onPaymentMethodChange: (method: string | null) => void;
  isLoadingPaymentMethods?: boolean;
}

export default function P2PFilters({
  availableAssets,
  availableFiatCurrencies,
  paymentMethods,
  selectedAsset,
  selectedFiatCurrency,
  selectedPaymentMethod,
  onAssetChange,
  onFiatCurrencyChange,
  onPaymentMethodChange,
  isLoadingPaymentMethods = false,
}: P2PFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 mb-6">
      <div className="flex flex-col">
        <label htmlFor="asset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Asset
        </label>
        <select
          id="asset"
          value={selectedAsset}
          onChange={(e) => onAssetChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-200 dark:text-white"
        >
          {availableAssets.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="fiatCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fiat Currency
        </label>
        <select
          id="fiatCurrency"
          value={selectedFiatCurrency}
          onChange={(e) => onFiatCurrencyChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-200 dark:text-white"
        >
          {availableFiatCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={selectedPaymentMethod || ''}
          onChange={(e) => onPaymentMethodChange(e.target.value || null)}
          disabled={isLoadingPaymentMethods}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-200 dark:text-white disabled:bg-gray-100 dark:disabled:bg-dark-300 disabled:cursor-not-allowed"
        >
          <option value="">All payment methods</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 