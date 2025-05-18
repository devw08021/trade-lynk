'use client';

import React from 'react';

interface OrderBookProps {
  data?: {
    bids?: [string, string][];
    asks?: [string, string][];
  };
  isPerpetual?: boolean;
}

export default function OrderBook({ data, isPerpetual = false }: OrderBookProps) {
  const mockBids = [
    ['39500.50', '0.12345'],
    ['39499.00', '0.25000'],
    ['39498.75', '0.18700'],
    ['39497.25', '0.32100'],
    ['39496.00', '0.45000'],
  ];

  const mockAsks = [
    ['39501.00', '0.15600'],
    ['39502.50', '0.22000'],
    ['39503.25', '0.17800'],
    ['39504.00', '0.31200'],
    ['39505.50', '0.28000'],
  ];

  const bids = data?.bids || mockBids;
  const asks = data?.asks || mockAsks;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 py-2">
        <div className="text-left">Price (USD)</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Asks (Sell orders) - displayed in reverse order */}
        <div className="text-red-500 dark:text-red-400">
          {asks.slice().reverse().map((ask, index) => {
            const [price, amount] = ask;
            const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
            
            return (
              <div key={`ask-${index}`} className="grid grid-cols-3 text-xs py-1 hover:bg-gray-100 dark:hover:bg-dark-200">
                <div className="text-left">{price}</div>
                <div className="text-right">{amount}</div>
                <div className="text-right">{total}</div>
              </div>
            );
          })}
        </div>
        
        {/* Spread */}
        <div className="py-2 border-y border-gray-200 dark:border-gray-700 text-xs text-center bg-gray-50 dark:bg-dark-300">
          <span className="font-medium">
            Spread: {(parseFloat(asks[0][0]) - parseFloat(bids[0][0])).toFixed(2)} 
            ({((parseFloat(asks[0][0]) - parseFloat(bids[0][0])) / parseFloat(bids[0][0]) * 100).toFixed(2)}%)
          </span>
        </div>
        
        {/* Bids (Buy orders) */}
        <div className="text-green-500 dark:text-green-400">
          {bids.map((bid, index) => {
            const [price, amount] = bid;
            const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
            
            return (
              <div key={`bid-${index}`} className="grid grid-cols-3 text-xs py-1 hover:bg-gray-100 dark:hover:bg-dark-200">
                <div className="text-left">{price}</div>
                <div className="text-right">{amount}</div>
                <div className="text-right">{total}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 