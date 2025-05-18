'use client';

import React from 'react';

interface Trade {
  id?: string;
  price: string;
  quantity: string;
  time?: string;
  isBuyerMaker?: boolean;
}

interface TradeHistoryProps {
  trades: Trade[];
  isPerpetual?: boolean;
}

export default function TradeHistory({ trades, isPerpetual = false }: TradeHistoryProps) {
  const mockTrades = [
    { id: '1', price: '39500.50', quantity: '0.1234', time: new Date().toISOString(), isBuyerMaker: true },
    { id: '2', price: '39501.25', quantity: '0.0565', time: new Date().toISOString(), isBuyerMaker: false },
    { id: '3', price: '39499.75', quantity: '0.0789', time: new Date().toISOString(), isBuyerMaker: true },
    { id: '4', price: '39502.00', quantity: '0.1123', time: new Date().toISOString(), isBuyerMaker: false },
    { id: '5', price: '39502.50', quantity: '0.0457', time: new Date().toISOString(), isBuyerMaker: false },
    { id: '6', price: '39499.00', quantity: '0.0325', time: new Date().toISOString(), isBuyerMaker: true },
  ];

  const displayTrades = trades.length > 0 ? trades : mockTrades;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 py-2">
        <div className="text-left">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Time</div>
      </div>

      <div className="overflow-y-auto flex-1">
        {displayTrades.map((trade, index) => {
          const time = trade.time ? new Date(trade.time).toLocaleTimeString() : new Date().toLocaleTimeString();
          
          return (
            <div 
              key={trade.id || `trade-${index}`} 
              className="grid grid-cols-3 text-xs py-1 hover:bg-gray-100 dark:hover:bg-dark-200"
            >
              <div className={`text-left ${trade.isBuyerMaker ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {trade.price}
              </div>
              <div className="text-right">{trade.quantity}</div>
              <div className="text-right text-gray-500 dark:text-gray-400">{time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 