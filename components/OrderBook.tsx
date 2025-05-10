'use client';
import { useState } from 'react';

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookData {
  asks: Order[];
  bids: Order[];
}

interface OrderBookProps {
  orderBookData: OrderBookData;
}

export default function OrderBook({ orderBookData }: OrderBookProps) {
  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Order Book</h3>
      </div>
      <div className="mb-2">
        <div className="grid grid-cols-3 text-xs text-gray-400 mb-1 px-2">
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Total (USDT)</div>
        </div>
        <div className="space-y-1">
          {orderBookData.asks
            .slice()
            .reverse()
            .map((ask, index) => (
              <div key={`ask-${index}`} className="grid grid-cols-3 text-xs py-1 px-2 hover:bg-gray-800/50">
                <div className="text-red-400">{ask.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-right text-gray-300">
                  {ask.amount.toLocaleString('en-US', { minimumFractionDigits: 6 })}
                </div>
                <div className="text-right text-gray-400">
                  {ask.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="py-3 text-center text-xl font-bold text-white border-t teléfonos
      border-b border-gray-700/50">
        62,843.17
      </div>
      <div className="mt-2">
        <div className="space-y-1">
          {orderBookData.bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 text-xs py-1 px-2 hover:bg-gray-800/50">
              <div className="text-green-400">{bid.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-right text-gray-300">
                {bid.amount.toLocaleString('en-US', { minimumFractionDigits: 6 })}
              </div>
              <div className="text-right text-gray-400">
                {bid.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}