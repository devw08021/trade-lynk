'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, ChartBarIcon, ClockIcon, ScaleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface CoinInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: {
    name: string;
    symbol: string;
    logo: string;
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
    high24h: number;
    low24h: number;
    supply: {
      circulating: number;
      total: number;
      max?: number;
    };
    description?: string;
    website?: string;
    whitepaper?: string;
  } | null;
  isLoading: boolean;
}

export default function CoinInfoModal({
  isOpen,
  onClose,
  coin,
  isLoading,
}: CoinInfoModalProps) {
  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading Coin Information" size="lg">
        <div className="flex flex-col items-center justify-center py-10">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading market data...</p>
        </div>
      </Modal>
    );
  }

  if (!coin) {
    return null;
  }

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      ...options,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: num < 0.1 ? 6 : 2,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      signDisplay: 'exceptZero',
      maximumFractionDigits: 2,
    }).format(num / 100);
  };

  const isPriceUp = coin.priceChange24h >= 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${coin.name} (${coin.symbol.toUpperCase()}) Information`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Coin header */}
        <div className="flex items-center space-x-4">
          <img 
            src={coin.logo} 
            alt={`${coin.name} logo`} 
            className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-200 p-2"
          />
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              {coin.name} <span className="text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
            </h2>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(coin.price)}
              </span>
              <span className={`ml-2 flex items-center ${
                isPriceUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPriceUp ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                )}
                {formatPercentage(coin.priceChange24h)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
              <CurrencyDollarIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">Market Cap</span>
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(coin.marketCap)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
              <ChartBarIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">24h Volume</span>
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(coin.volume24h)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">24h High</span>
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(coin.high24h)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
              <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">24h Low</span>
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(coin.low24h)}
            </div>
          </div>
        </div>
        
        {/* Supply info */}
        <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <ScaleIcon className="w-5 h-5 mr-1" />
            Supply Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Circulating Supply</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatNumber(coin.supply.circulating)} {coin.symbol.toUpperCase()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Supply</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatNumber(coin.supply.total)} {coin.symbol.toUpperCase()}
              </div>
            </div>
            
            {coin.supply.max !== undefined && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Max Supply</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(coin.supply.max)} {coin.symbol.toUpperCase()}
                </div>
              </div>
            )}
          </div>
          
          {/* Supply progress bar */}
          {coin.supply.max && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-primary-600 bg-primary-200 dark:bg-primary-900 dark:text-primary-300">
                      {formatPercentage((coin.supply.circulating / coin.supply.max) * 100)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                      of max supply
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-primary-200 dark:bg-dark-100">
                  <div style={{ width: `${(coin.supply.circulating / coin.supply.max) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Description */}
        {coin.description && (
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">About {coin.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {coin.description}
            </p>
          </div>
        )}
        
        {/* Links */}
        {(coin.website || coin.whitepaper) && (
          <div className="border-t border-gray-200 dark:border-dark-100 pt-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resources</h3>
            <div className="flex space-x-3">
              {coin.website && (
                <a 
                  href={coin.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Official Website
                </a>
              )}
              {coin.whitepaper && (
                <a 
                  href={coin.whitepaper} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Whitepaper
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 