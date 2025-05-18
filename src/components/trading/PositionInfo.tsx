'use client';

import React from 'react';
import { useClosePositionMutation } from '@/services/perpetualService';

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  markPrice: string;
  liquidationPrice: string;
  margin: string;
  leverage: number;
  unrealizedPnl: string;
  unrealizedPnlPercent: string;
  marginRatio: string;
  createdAt: string;
  updatedAt: string;
}

interface PositionInfoProps {
  position: Position;
  markPrice?: {
    markPrice: string;
    indexPrice: string;
    fundingRate: string;
  };
}

export default function PositionInfo({ position, markPrice }: PositionInfoProps) {
  const [closePosition, { isLoading }] = useClosePositionMutation();

  const pnlPercent = parseFloat(position?.unrealizedPnlPercent || '0');
  const isProfitable = pnlPercent >= 0;

  const marginRatio = parseFloat(position?.marginRatio || '0');
  let riskLevel = 'Low';
  let riskColor = 'text-green-500 dark:text-green-400';
  
  if (marginRatio < 0.05) {
    riskLevel = 'Extreme';
    riskColor = 'text-red-500 dark:text-red-400';
  } else if (marginRatio < 0.1) {
    riskLevel = 'High';
    riskColor = 'text-orange-500 dark:text-orange-400';
  } else if (marginRatio < 0.15) {
    riskLevel = 'Medium';
    riskColor = 'text-yellow-500 dark:text-yellow-400';
  }

  const handleClosePosition = () => {
    // closePosition({
    //   symbol: position.symbol,
    //   positionSide: position.side
    // });
  };

  if (!position) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No open position
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Position</h3>
      
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Side</span>
          <span className={`text-base font-medium ${
            position.side === 'long' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          } capitalize`}>
            {position.side}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Size</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            {position.size}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Leverage</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            {position.leverage}×
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Entry Price</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            ${position.entryPrice}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Mark Price</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            ${markPrice?.markPrice || position.markPrice}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Liquidation Price</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            ${position.liquidationPrice}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Margin</span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            ${position.margin}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Risk Level</span>
          <span className={`text-base font-medium ${riskColor}`}>
            {riskLevel}
          </span>
        </div>
        
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Unrealized PnL</span>
          <div>
            <span className={`text-base font-medium ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isProfitable ? '+' : ''}{position.unrealizedPnl} ({isProfitable ? '+' : ''}{position.unrealizedPnlPercent}%)
            </span>
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleClosePosition}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? 'Closing...' : 'Close Position'}
          </button>
        </div>
      </div>
    </div>
  );
} 