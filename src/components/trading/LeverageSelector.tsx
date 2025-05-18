'use client';

import React, { useState } from 'react';
import { useAdjustLeverageMutation } from '@/services/perpetualService';

interface LeverageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  maxLeverage: number;
  symbol: string;
}

export default function LeverageSelector({ value, onChange, maxLeverage, symbol }: LeverageSelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [adjustLeverage, { isLoading }] = useAdjustLeverageMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(parseInt(e.target.value) || 1, maxLeverage);
    setInputValue(newValue.toString());
    onChange(newValue);
    
    // adjustLeverage({ symbol, leverage: newValue });
  };
  
  const presetLeverages = [1, 5, 10, 25, 50, 100].filter(l => l <= maxLeverage);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Leverage
        </label>
        <div className="relative rounded-md shadow-sm max-w-[80px]">
          <input
            type="number"
            min="1"
            max={maxLeverage}
            value={inputValue}
            onChange={handleChange}
            className="block w-full border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-gray-100 sm:text-sm text-right"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">×</span>
          </div>
        </div>
      </div>
      
      <div className="mb-1">
        <input
          type="range"
          min="1"
          max={maxLeverage}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 dark:bg-dark-200 rounded-full appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between flex-wrap gap-2">
        {presetLeverages.map(leverage => (
          <button
            key={leverage}
            onClick={() => {
              setInputValue(leverage.toString());
              onChange(leverage);
            }}
            className={`px-2 py-1 text-xs font-medium rounded ${
              value === leverage 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-400'
            }`}
          >
            {leverage}×
          </button>
        ))}
      </div>
    </div>
  );
} 