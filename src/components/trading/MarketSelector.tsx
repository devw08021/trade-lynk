'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MarketSelectorProps {
  pairs: Record<string, any>;
  selectedPair: string | null;
  onSelectPair: (pair: string) => void;
  type?: 'spot' | 'perpetual';
}

export default function MarketSelector({ 
  pairs, 
  selectedPair, 
  onSelectPair,
  type = 'spot'
}: MarketSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPairs = Object.entries(pairs).filter(([symbol]) => 
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-dark-300 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {type === 'spot' ? 'Spot Markets' : 'Perpetual Markets'}
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search markets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-1 text-sm border border-gray-300 dark:border-dark-100 rounded-md bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-2 top-2 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filteredPairs.map(([symbol, data]) => (
          <button
            key={symbol}
            onClick={() => onSelectPair(symbol)}
            className={`p-2 text-sm rounded-md transition-colors ${
              selectedPair === symbol 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium'
                : 'bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100'
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
} 