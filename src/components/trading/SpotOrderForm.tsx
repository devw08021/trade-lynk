'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CurrencyDollarIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SpotOrderFormProps {
  pair: any;
  orderBook?: any;
}

export default function SpotOrderForm({ pair, orderBook }: SpotOrderFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_limit'>('limit');
  const [price, setPrice] = useState(pair?.lastPrice || '');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [stopPrice, setStopPrice] = useState('');

  // Mock balance data
  const mockBalance = {
    available: 1000.00,
    currency: 'USDT',
    baseAvailable: 0.5,
    baseCurrency: pair?.baseAsset || 'BTC'
  };

  const calculateTotal = (newPrice: string, newAmount: string) => {
    if (newPrice && newAmount) {
      const calculatedTotal = (parseFloat(newPrice) * parseFloat(newAmount)).toFixed(2);
      setTotal(calculatedTotal);
    } else {
      setTotal('');
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    calculateTotal(newPrice, amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    calculateTotal(price, newAmount);
    setPercentage(0);
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = e.target.value;
    setTotal(newTotal);

    if (price && parseFloat(price) > 0) {
      const calculatedAmount = (parseFloat(newTotal) / parseFloat(price)).toFixed(8);
      setAmount(calculatedAmount);
    }
  };

  const handlePercentageChange = (percent: number) => {
    setPercentage(percent);
    const maxAmount = mockBalance.available / parseFloat(price || '1');
    const newAmount = ((maxAmount * percent) / 100).toFixed(8);
    setAmount(newAmount);
    calculateTotal(price, newAmount);
  };

  const fillFromOrderBook = (side: 'buy' | 'sell') => {
    if (!orderBook) return;

    const orders = side === 'buy' ? orderBook.asks : orderBook.bids;
    if (orders && orders.length > 0) {
      setPrice(orders[0][0]);
      calculateTotal(orders[0][0], amount);
    }
  };

  const tradingFee = 0.001; // 0.1% fee
  const estimatedFee = parseFloat(total || '0') * tradingFee;

  return (
    <div className="space-y-6">
      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-[#0f1012] rounded-lg p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-colors ${selected
              ? 'bg-green-600 text-white shadow-sm'
              : 'text-gradient-secondary hover:text-white hover:bg-green-600/20'
            }`
          }>
            Buy {pair?.baseAsset || 'BTC'}
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-colors ${selected
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-gradient-secondary hover:text-white hover:bg-red-600/20'
            }`
          }>
            Sell {pair?.baseAsset || 'BTC'}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Buy Panel */}
          <Tab.Panel className="space-y-6">
            {/* Order Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Order Type</label>
              <div className="flex space-x-2">
                {['market', 'limit', 'stop_limit'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${orderType === type
                        ? 'bg-brand text-black'
                        : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                      }`}
                    onClick={() => setOrderType(type as any)}
                  >
                    {type === 'stop_limit' ? 'Stop Limit' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="card-dark">
              <div className="flex-between text-sm mb-2">
                <span className="text-gradient-secondary">Available Balance:</span>
                <span className="text-white font-medium">
                  {mockBalance.available.toFixed(2)} {mockBalance.currency}
                </span>
              </div>
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Available {pair?.baseAsset}:</span>
                <span className="text-white font-medium">
                  {mockBalance.baseAvailable.toFixed(8)} {pair?.baseAsset}
                </span>
              </div>
            </div>

            {/* Stop Price for Stop Limit Orders */}
            {orderType === 'stop_limit' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Stop Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    className="form-input pr-16"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Input */}
            {orderType !== 'market' && (
              <div>
                <div className="flex-between mb-2">
                  <label className="text-sm font-medium text-white">
                    Price
                  </label>
                  <button
                    onClick={() => fillFromOrderBook('buy')}
                    className="text-xs text-brand hover:text-[#a6e600] transition-colors"
                  >
                    Use Best Ask
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    className="form-input pr-16"
                    placeholder={pair?.lastPrice || "0.00"}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="form-input pr-16"
                  placeholder="0.00000000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gradient-secondary text-sm">
                    {pair?.baseAsset || "BTC"}
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage Buttons */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Quick Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => handlePercentageChange(percent)}
                    className={`py-2 text-sm rounded-md font-medium transition-colors ${percentage === percent
                        ? 'bg-brand text-black'
                        : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                      }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Total Input */}
            {orderType !== 'market' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Total
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={total}
                    onChange={handleTotalChange}
                    className="form-input pr-16"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="card-dark space-y-2">
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Order Value:</span>
                <span className="text-white">${total || '0.00'}</span>
              </div>
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Trading Fee (0.1%):</span>
                <span className="text-white">${estimatedFee.toFixed(2)}</span>
              </div>
              <div className="flex-between text-sm border-t border-[#2a2b2e] pt-2 font-medium">
                <span className="text-white">Total Cost:</span>
                <span className="text-brand">${(parseFloat(total || '0') + estimatedFee).toFixed(2)}</span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              disabled={!amount || parseFloat(amount) <= 0}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${!amount || parseFloat(amount) <= 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {orderType === 'market' ? 'Buy Market' : 'Place Buy Order'}
            </button>

            {/* Risk Warning */}
            <div className="alert-warning">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p><strong>Risk Warning:</strong> Trading involves substantial risk. Only trade with funds you can afford to lose.</p>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Sell Panel */}
          <Tab.Panel className="space-y-6">
            {/* Order Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Order Type</label>
              <div className="flex space-x-2">
                {['market', 'limit', 'stop_limit'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${orderType === type
                        ? 'bg-brand text-black'
                        : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                      }`}
                    onClick={() => setOrderType(type as any)}
                  >
                    {type === 'stop_limit' ? 'Stop Limit' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="card-dark">
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Available {pair?.baseAsset}:</span>
                <span className="text-white font-medium">
                  {mockBalance.baseAvailable.toFixed(8)} {pair?.baseAsset}
                </span>
              </div>
            </div>

            {/* Same form fields as Buy but with different calculations */}
            {orderType === 'stop_limit' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Stop Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    className="form-input pr-16"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {orderType !== 'market' && (
              <div>
                <div className="flex-between mb-2">
                  <label className="text-sm font-medium text-white">
                    Price
                  </label>
                  <button
                    onClick={() => fillFromOrderBook('sell')}
                    className="text-xs text-brand hover:text-[#a6e600] transition-colors"
                  >
                    Use Best Bid
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    className="form-input pr-16"
                    placeholder={pair?.lastPrice || "0.00"}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="form-input pr-16"
                  placeholder="0.00000000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gradient-secondary text-sm">
                    {pair?.baseAsset || "BTC"}
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage Buttons for Sell */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Quick Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => {
                      setPercentage(percent);
                      const newAmount = ((mockBalance.baseAvailable * percent) / 100).toFixed(8);
                      setAmount(newAmount);
                      calculateTotal(price, newAmount);
                    }}
                    className={`py-2 text-sm rounded-md font-medium transition-colors ${percentage === percent
                        ? 'bg-brand text-black'
                        : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                      }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Total for Sell */}
            {orderType !== 'market' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Total
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={total}
                    onChange={handleTotalChange}
                    className="form-input pr-16"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gradient-secondary text-sm">
                      {pair?.quoteAsset || 'USDT'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary for Sell */}
            <div className="card-dark space-y-2">
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Order Value:</span>
                <span className="text-white">${total || '0.00'}</span>
              </div>
              <div className="flex-between text-sm">
                <span className="text-gradient-secondary">Trading Fee (0.1%):</span>
                <span className="text-white">${estimatedFee.toFixed(2)}</span>
              </div>
              <div className="flex-between text-sm border-t border-[#2a2b2e] pt-2 font-medium">
                <span className="text-white">You'll Receive:</span>
                <span className="text-brand">${(parseFloat(total || '0') - estimatedFee).toFixed(2)}</span>
              </div>
            </div>

            {/* Sell Button */}
            <button
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > mockBalance.baseAvailable}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${!amount || parseFloat(amount) <= 0 || parseFloat(amount) > mockBalance.baseAvailable
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
            >
              {orderType === 'market' ? 'Sell Market' : 'Place Sell Order'}
            </button>

            {/* Risk Warning */}
            <div className="alert-warning">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p><strong>Risk Warning:</strong> Market orders execute immediately at current market price. Limit orders may not fill if price doesn't reach your target.</p>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Market Info */}
      <div className="card-dark">
        <div className="flex items-center mb-3">
          <InformationCircleIcon className="h-5 w-5 text-brand mr-2" />
          <h4 className="font-medium text-white">Market Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gradient-secondary block">24h Volume</span>
            <span className="text-white font-medium">
              {parseFloat(pair?.volume || '0').toLocaleString()} {pair?.baseAsset}
            </span>
          </div>
          <div>
            <span className="text-gradient-secondary block">24h Change</span>
            <span className={`font-medium ${parseFloat(pair?.priceChangePercent || '0') >= 0 ? 'status-positive' : 'status-negative'
              }`}>
              {pair?.priceChangePercent}%
            </span>
          </div>
          <div>
            <span className="text-gradient-secondary block">24h High</span>
            <span className="text-white font-medium">${pair?.high}</span>
          </div>
          <div>
            <span className="text-gradient-secondary block">24h Low</span>
            <span className="text-white font-medium">${pair?.low}</span>
          </div>
        </div>
      </div>

      {/* Order Book Quick Access */}
      {orderBook && (
        <div className="card-dark">
          <h4 className="font-medium text-white mb-3">Quick Order Book</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gradient-secondary mb-2">Best Ask (Sell)</div>
              {orderBook.asks?.slice(0, 3).map((ask: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setPrice(ask[0]);
                    calculateTotal(ask[0], amount);
                  }}
                  className="flex-between w-full text-xs py-1 hover:bg-[#2a2b2e] rounded transition-colors"
                >
                  <span className="status-negative">${parseFloat(ask[0]).toFixed(2)}</span>
                  <span className="text-gradient-secondary">{parseFloat(ask[1]).toFixed(4)}</span>
                </button>
              ))}
            </div>
            <div>
              <div className="text-xs text-gradient-secondary mb-2">Best Bid (Buy)</div>
              {orderBook.bids?.slice(0, 3).map((bid: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setPrice(bid[0]);
                    calculateTotal(bid[0], amount);
                  }}
                  className="flex-between w-full text-xs py-1 hover:bg-[#2a2b2e] rounded transition-colors"
                >
                  <span className="status-positive">${parseFloat(bid[0]).toFixed(2)}</span>
                  <span className="text-gradient-secondary">{parseFloat(bid[1]).toFixed(4)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trading Tips */}
      <div className="card-dark">
        <h4 className="font-medium text-brand mb-3">Trading Tips</h4>
        <ul className="text-sm text-gradient-secondary space-y-1">
          <li>• Use limit orders for better price control</li>
          <li>• Market orders execute immediately but may have slippage</li>
          <li>• Stop-limit orders help manage risk automatically</li>
          <li>• Always check your balance before placing orders</li>
        </ul>
      </div>
    </div>
  );
}

