'use client';

import React from 'react';

interface SpotTradingViewProps {
  symbol: string;
}

export default function SpotTradingView({ symbol }: SpotTradingViewProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{symbol} Chart</h2>
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-300 hover:bg-gray-200 dark:hover:bg-dark-200 rounded">1H</button>
          <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-300 hover:bg-gray-200 dark:hover:bg-dark-200 rounded">4H</button>
          <button className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">1D</button>
          <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-300 hover:bg-gray-200 dark:hover:bg-dark-200 rounded">1W</button>
        </div>
      </div>
      
      <div className="flex-grow w-full bg-gray-50 dark:bg-dark-300 rounded-md flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Trading Chart Placeholder</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Integration with a real charting library would go here</p>
        </div>
      </div>
    </div>
  );
} 