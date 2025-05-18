'use client';

import React, { useState } from 'react';
import { ConfirmationModal } from '@/components/ui';
import { TradeConfirmationModal } from '@/components/trading';

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState('spot');
  const [orderType, setOrderType] = useState('limit');
  const [tradeType, setTradeType] = useState('buy');
  const [price, setPrice] = useState('39245.30');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('0.00');
  
  const [tradeModal, setTradeModal] = useState({
    isOpen: false,
    tradeType: 'buy' as 'buy' | 'sell',
    coinPair: 'BTC/USDT',
    amount: 0,
    price: 0,
    total: 0,
    fee: 0,
  });
  
  const [deleteOrderModal, setDeleteOrderModal] = useState({
    isOpen: false,
    orderId: '',
  });
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
    
    if (value && price) {
      const calculatedTotal = parseFloat(value) * parseFloat(price);
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal('0.00');
    }
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPrice(value);
    
    if (value && amount) {
      const calculatedTotal = parseFloat(value) * parseFloat(amount);
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal('0.00');
    }
  };
  
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setTotal(value);
    
    if (value && price && parseFloat(price) > 0) {
      const calculatedAmount = parseFloat(value) / parseFloat(price);
      setAmount(calculatedAmount.toFixed(8));
    } else {
      setAmount('');
    }
  };
  
  const showTradeModal = () => {
    const calculatedFee = parseFloat(total) * 0.001;
    
    setTradeModal({
      isOpen: true,
      tradeType: tradeType as 'buy' | 'sell',
      coinPair: 'BTC/USDT',
      amount: parseFloat(amount) || 0,
      price: parseFloat(price) || 0,
      total: parseFloat(total) || 0,
      fee: calculatedFee,
    });
  };
  
  const confirmTrade = () => {
    setTradeModal(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">BTC/USDT</span>
              <span className="text-green-600 dark:text-green-400">$39,245.30</span>
              <span className="text-green-600 dark:text-green-400 text-sm">+2.4%</span>
            </div>
            <div className="space-x-2">
              <button className="bg-gray-200 dark:bg-dark-200 px-3 py-1 rounded-md text-sm">1D</button>
              <button className="bg-gray-200 dark:bg-dark-200 px-3 py-1 rounded-md text-sm">1W</button>
              <button className="bg-gray-200 dark:bg-dark-200 px-3 py-1 rounded-md text-sm">1M</button>
            </div>
          </div>
          
          <div className="w-full h-64 bg-gray-100 dark:bg-dark-200 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart Placeholder
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                tradeType === 'buy' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setTradeType('buy')}
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                tradeType === 'sell' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setTradeType('sell')}
            >
              Sell
            </button>
          </div>
          
          <div className="flex space-x-2 mb-6">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                orderType === 'limit' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setOrderType('limit')}
            >
              Limit
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                orderType === 'market' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setOrderType('market')}
            >
              Market
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                orderType === 'stop' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setOrderType('stop')}
            >
              Stop
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (USDT)
              </label>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                disabled={orderType === 'market'}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (BTC)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="flex space-x-1">
                    <button 
                      className="text-xs text-primary-600 dark:text-primary-400"
                      onClick={() => {
                        const value = 0.25 * parseFloat(total) / parseFloat(price);
                        setAmount(value.toFixed(8));
                        setTotal((0.25 * parseFloat(total)).toFixed(2));
                      }}
                    >
                      25%
                    </button>
                    <button 
                      className="text-xs text-primary-600 dark:text-primary-400"
                      onClick={() => {
                        const value = 0.50 * parseFloat(total) / parseFloat(price);
                        setAmount(value.toFixed(8));
                        setTotal((0.50 * parseFloat(total)).toFixed(2));
                      }}
                    >
                      50%
                    </button>
                    <button 
                      className="text-xs text-primary-600 dark:text-primary-400"
                      onClick={() => {
                        const value = 0.75 * parseFloat(total) / parseFloat(price);
                        setAmount(value.toFixed(8));
                        setTotal((0.75 * parseFloat(total)).toFixed(2));
                      }}
                    >
                      75%
                    </button>
                    <button 
                      className="text-xs text-primary-600 dark:text-primary-400"
                      onClick={() => {
                        const value = 1.0 * parseFloat(total) / parseFloat(price);
                        setAmount(value.toFixed(8));
                        setTotal((1.0 * parseFloat(total)).toFixed(2));
                      }}
                    >
                      100%
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total (USDT)
              </label>
              <input
                type="text"
                value={total}
                onChange={handleTotalChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:text-white sm:text-sm"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={showTradeModal}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tradeType === 'buy' ? 'Buy BTC' : 'Sell BTC'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-dark-300 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Open Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-100">
            <thead className="bg-gray-50 dark:bg-dark-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pair</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Side</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filled</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-300 divide-y divide-gray-200 dark:divide-dark-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2023-06-12 14:23</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">BTC/USDT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Limit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">Buy</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">38,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">0.05</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">0%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1,925.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setDeleteOrderModal({ isOpen: true, orderId: '12345' })}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2023-06-11 09:45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">ETH/USDT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Limit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">Sell</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2,400.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1.5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">0%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">3,600.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setDeleteOrderModal({ isOpen: true, orderId: '12346' })}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <TradeConfirmationModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmTrade}
        tradeType={tradeModal.tradeType}
        coinPair={tradeModal.coinPair}
        amount={tradeModal.amount}
        price={tradeModal.price}
        total={tradeModal.total}
        fee={tradeModal.fee}
      />
      
      <ConfirmationModal
        isOpen={deleteOrderModal.isOpen}
        onClose={() => setDeleteOrderModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {  
          setDeleteOrderModal(prev => ({ ...prev, isOpen: false }));
        }}
        title="Cancel Order"
        message={`Are you sure you want to cancel this order? This action cannot be undone.`}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        type="danger"
      />
    </div>
  );
} 