'use client';

import React from 'react';

interface P2PFiltersProps {
  pair: string[];
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
  pair,
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
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 mb-6 p-4 bg-[#0f1012] rounded-lg border border-[#2a2b2e]">
      <div className="flex flex-col flex-1">
        <label htmlFor="asset" className="block text-sm font-medium text-white mb-2">
          Cryptocurrency
        </label>
        <select
          id="asset"
          value={selectedAsset}
          onChange={(e) => onAssetChange(e.target.value)}
          className="form-select"
        >
          <option value="">All cryptocurrencies</option>
          {Array.from(new Map(
            pair.map((currency) => [currency.firstCoin, currency])
          ).values()).map((currency) => (
            <option key={currency.firstCoinId} value={currency.firstCoinId}>
              {currency.firstCoin}
            </option>
          ))}

        </select>
      </div>

      <div className="flex flex-col flex-1">
        <label htmlFor="fiatCurrency" className="block text-sm font-medium text-white mb-2">
          Fiat Currency
        </label>
        <select
          id="fiatCurrency"
          value={selectedFiatCurrency}
          onChange={(e) => onFiatCurrencyChange(e.target.value)}
          className="form-select"
        >
          <option value="">All fiat currencies</option>
          {Array.from(new Map(
            pair.map((currency) => [currency.secondCoin, currency])
          ).values()).map((currency) => (
            <option key={currency.secondCoinId} value={currency.secondCoinId}>
              {currency.secondCoin}
            </option>
          ))}

        </select>
      </div>

      <div className="flex flex-col flex-1">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-white mb-2">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={selectedPaymentMethod || ''}
          onChange={(e) => onPaymentMethodChange(e.target.value || null)}
          disabled={isLoadingPaymentMethods}
          className={`form-select ${isLoadingPaymentMethods ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">All payment methods</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {isLoadingPaymentMethods && (
          <div className="mt-1 flex items-center">
            <div className="loading-spinner mr-2" style={{ width: '12px', height: '12px' }}></div>
            <span className="text-xs text-gradient-secondary">Loading payment methods...</span>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <div className="flex flex-col justify-end">
        <button
          onClick={() => {
            onAssetChange('BTC');
            onFiatCurrencyChange('USD');
            onPaymentMethodChange(null);
          }}
          className="btn-outline text-sm px-4 py-2 h-10"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
