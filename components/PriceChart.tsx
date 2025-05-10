'use client';
import { useState } from 'react';

interface PriceChartProps {
  marketData: {
    high24h: number;
    low24h: number;
  };
}

export default function PriceChart({ marketData }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState('1D');

  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Price Chart</h3>
        <div className="flex space-x-1">
          {['1H', '4H', '1D', '1W', '1M'].map((time) => (
            <button
              key={time}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === time
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
              onClick={() => setTimeframe(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full h-full flex items-end">
            <div className="relative w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                </linearGradient>
                <path
                  d="M0,100 L0,40 L20,50 L40,20 L60,30 L80,10 L100,25 L100,100 Z"
                  fill="url(#gradient)"
                />
                <path
                  d="M0,40 L20,50 L40,20 L60,30 L80,10 L100,25"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                />
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
          <span>${(marketData.high24h * 1.01).toFixed(2)}</span>
          <span>${((marketData.high24h + marketData.low24h) / 2).toFixed(2)}</span>
          <span>${(marketData.low24h * 0.99).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}