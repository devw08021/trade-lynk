'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

interface SpotOrderFormProps {
  pair: any;
  orderBook?: any;
}

export default function SpotOrderForm({ pair, orderBook }: SpotOrderFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState(0);

  const calculateTotal = (newPrice: string, newAmount: string) => {
    if (newPrice && newAmount) {
      const calculatedTotal = (parseFloat(newPrice) * parseFloat(newAmount)).toFixed(2);
      setTotal(calculatedTotal);
    } else {
      setTotal('');
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    calculateTotal(newPrice, amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    calculateTotal(price, newAmount);
    setPercentage(0);
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = e.target.value;
    setTotal(newTotal);
    
    if (price) {
      const calculatedAmount = (parseFloat(newTotal) / parseFloat(price)).toFixed(8);
      setAmount(calculatedAmount);
    }
  };

  const handlePercentageChange = (percent: number) => {
    setPercentage(percent);
    const maxAmount = 1.0; 
    const newAmount = ((maxAmount * percent) / 100).toFixed(8);
    setAmount(newAmount);
    calculateTotal(price, newAmount);
  };

  return (
    <div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-dark-200 p-1 mb-4">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-green-700 dark:hover:text-green-400'
            }`
          }>
            Buy
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-red-700 dark:hover:text-red-400'
            }`
          }>
            Sell
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 text-xs rounded ${orderType === 'market' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded ${orderType === 'limit' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
              </div>
              
              {orderType === 'limit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      value={price}
                      onChange={handlePriceChange}
                      className="block w-full border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-gray-100 sm:text-sm"
                      placeholder={pair?.lastPrice || "0.00"}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="block w-full border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-gray-100 sm:text-sm"
                    placeholder="0.00000000"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      {pair?.baseAsset || "BTC"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => handlePercentageChange(25)} 
                  className={`py-1 text-xs rounded ${percentage === 25 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'}`}
                >
                  25%
                </button>
                <button 
                  onClick={() => handlePercentageChange(50)} 
                  className={`py-1 text-xs rounded ${percentage === 50 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'}`}
                >
                  50%
                </button>
                <button 
                  onClick={() => handlePercentageChange(75)} 
                  className={`py-1 text-xs rounded ${percentage === 75 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'}`}
                >
                  75%
                </button>
                <button 
                  onClick={() => handlePercentageChange(100)} 
                  className={`py-1 text-xs rounded ${percentage === 100 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'}`}
                >
                  100%
                </button>
              </div>
              
              {orderType === 'limit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      value={total}
                      onChange={handleTotalChange}
                      className="block w-full border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-gray-100 sm:text-sm"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Buy {pair?.baseAsset || "BTC"}
              </button>
            </div>
          </Tab.Panel>
              
          <Tab.Panel>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 text-xs rounded ${orderType === 'market' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded ${orderType === 'limit' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
              </div>
              
              <button
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sell {pair?.baseAsset || "BTC"}
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 