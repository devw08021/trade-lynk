'use client';
import { useState } from 'react';

interface OrderFormProps {
  orderType: 'limit' | 'market' | 'stop';
  setOrderType: (type: 'limit' | 'market' | 'stop') => void;
  orderSide: 'buy' | 'sell';
  setOrderSide: (side: 'buy' | 'sell') => void;
}

export default function OrderForm({ orderType, setOrderType, orderSide, setOrderSide }: OrderFormProps) {
  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 rounded-tl-md rounded-bl-md font-medium ${
            orderSide === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          }`}
          onClick={() => setOrderSide('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2 rounded-tr-md rounded-br-md font-medium ${
            orderSide === 'sell'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          }`}
          onClick={() => setOrderSide('sell')}
        >
          Sell
        </button>
      </div>
      <div className="flex mb-4 bg-gray-800/50 rounded-md">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-l-md ${
            orderType === 'limit'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
          onClick={() => setOrderType('limit')}
        >
          Limit
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            orderType === 'market' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
          }`}
          onClick={() => setOrderType('market')}
        >
          Market
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-r-md ${
            orderType === 'stop' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
          }`}
          onClick={() => setOrderType('stop')}
        >
          Stop
        </button>
      </div>
      <div className="space-y-4">
        {orderType !== 'market' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400">USDT</span>
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">BTC</span>
            </div>
          </div>
        </div>
        {orderType !== 'market' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Total</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                placeholder="0.00"
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400">USDT</span>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          <button className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-xs py-1 rounded">25%</button>
          <button className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-xs py-1 rounded">50%</button>
          <button className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-xs py-1 rounded">75%</button>
          <button className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-xs py-1 rounded">100%</button>
        </div>
        <button
          className={`w-full py-3 px-4 rounded-md font-medium glow ${
            orderSide === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
              : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
          } text-white`}
        >
          {orderSide === 'buy' ? 'Buy BTC' : 'Sell BTC'}
        </button>
      </div>
    </div>
  );
}