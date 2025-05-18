'use client';

import React, { useState } from 'react';

interface PerpetualOrderFormProps {
  pair: any;
  leverage: number;
  side: 'long' | 'short';
}

export default function PerpetualOrderForm({ pair, leverage, side }: PerpetualOrderFormProps) {
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

  const handlePercentageChange = (percent: number) => {
    setPercentage(percent);
    const maxAmount = 1.0; 
    const newAmount = ((maxAmount * percent) / 100).toFixed(8);
    setAmount(newAmount);
    calculateTotal(price, newAmount);
  };

  return (
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
              placeholder={pair?.markPrice || "0.00"}
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
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leverage</span>
          <span className="text-sm text-primary-600 dark:text-primary-400">{leverage}×</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-dark-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 dark:bg-primary-600" 
            style={{ width: `${(leverage / (pair?.maxLeverage || 100)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>Cost: ~{parseFloat(total || '0') / leverage || 0} USD</div>
        <div>Fees: ~{(parseFloat(total || '0') * 0.0005).toFixed(2)} USD</div>
      </div>
      
      <button
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          side === 'long'
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        {side === 'long' ? 'Long' : 'Short'} {pair?.baseAsset || "BTC"}
      </button>
    </div>
  );
} 