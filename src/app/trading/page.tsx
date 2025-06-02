'use client';

import React, { useState } from 'react';
import { ConfirmationModal } from '@/components/ui';
import { TradeConfirmationModal } from '@/components/trading';
// import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';

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
  
  const handlePercentageClick = (percentage: number) => {
    // Mock balance for calculation
    const mockBalance = 1000;
    const calculatedTotal = mockBalance * percentage;
    setTotal(calculatedTotal.toFixed(2));
    
    if (price && parseFloat(price) > 0) {
      const calculatedAmount = calculatedTotal / parseFloat(price);
      setAmount(calculatedAmount.toFixed(8));
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
    <div className="page-wrapper">
      <div className="container-custom section-padding">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="heading-secondary text-gradient-muted mb-2">Advanced Trading</h1>
          <p className="text-gradient-secondary">Professional trading interface for your funded account</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 card">
            <div className="flex-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-light text-white">BTC/USDT</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-medium text-white">$39,245.30</span>
                  <span className="badge badge-success flex items-center">
                    {/* <TrendingUpIcon className="h-3 w-3 mr-1" /> */}
                    +2.4%
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="btn-outline text-xs px-3 py-1">1D</button>
                <button className="btn-outline text-xs px-3 py-1">1W</button>
                <button className="btn-outline text-xs px-3 py-1">1M</button>
              </div>
            </div>
            
            <div className="w-full h-80 bg-[#08090a] rounded-lg flex-center border border-[#2a2b2e]">
              <div className="text-center">
                <div className="text-brand text-4xl mb-2">📈</div>
                <p className="text-gradient-secondary">Advanced TradingView Chart</p>
                <p className="text-xs text-gradient-secondary mt-1">Real-time price data and technical indicators</p>
              </div>
            </div>

            {/* Market Statistics */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xs text-gradient-secondary mb-1">24h High</div>
                <div className="text-sm font-medium text-white">$39,890.50</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gradient-secondary mb-1">24h Low</div>
                <div className="text-sm font-medium text-white">$38,125.75</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gradient-secondary mb-1">24h Volume</div>
                <div className="text-sm font-medium text-white">1,245.67 BTC</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gradient-secondary mb-1">Market Cap</div>
                <div className="text-sm font-medium text-white">$768.5B</div>
              </div>
            </div>
          </div>
          
          {/* Trading Panel */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Place Order</h3>
              
              {/* Buy/Sell Toggle */}
              <div className="flex mb-6 bg-[#0f1012] rounded-lg p-1">
                <button
                  className={`flex-1 py-2 text-center rounded-md font-medium transition-colors ${
                    tradeType === 'buy' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gradient-secondary hover:text-white'
                  }`}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </button>
                <button
                  className={`flex-1 py-2 text-center rounded-md font-medium transition-colors ${
                    tradeType === 'sell' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gradient-secondary hover:text-white'
                  }`}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </button>
              </div>
              
              {/* Order Type Selection */}
              <div className="flex space-x-2 mb-6">
                <button
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    orderType === 'limit' 
                      ? 'bg-brand text-black' 
                      : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                  }`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    orderType === 'market' 
                      ? 'bg-brand text-black' 
                      : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                  }`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    orderType === 'stop' 
                      ? 'bg-brand text-black' 
                      : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                  }`}
                  onClick={() => setOrderType('stop')}
                >
                  Stop
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Price (USDT)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  disabled={orderType === 'market'}
                  className={`form-input ${orderType === 'market' ? 'opacity-50' : ''}`}
                  placeholder="Enter price"
                />
              </div>
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Amount (BTC)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="form-input pr-32"
                    placeholder="0.00000000"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="flex space-x-1">
                      {[0.25, 0.5, 0.75, 1.0].map((percentage) => (
                        <button 
                          key={percentage}
                          className="text-xs text-brand hover:text-[#a6e600] transition-colors"
                          onClick={() => handlePercentageClick(percentage)}
                        >
                          {Math.round(percentage * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Total Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Total (USDT)
                </label>
                <input
                  type="text"
                  value={total}
                  onChange={handleTotalChange}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              {/* Order Summary */}
              <div className="card-dark space-y-2">
                <div className="flex-between text-sm">
                  <span className="text-gradient-secondary">Available Balance:</span>
                  <span className="text-white">1,000.00 USDT</span>
                </div>
                <div className="flex-between text-sm">
                  <span className="text-gradient-secondary">Trading Fee (0.1%):</span>
                  <span className="text-white">${(parseFloat(total) * 0.001).toFixed(2)}</span>
                </div>
                <div className="flex-between text-sm font-medium border-t border-[#2a2b2e] pt-2">
                  <span className="text-white">Total Cost:</span>
                  <span className="text-brand">${(parseFloat(total) + parseFloat(total) * 0.001).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="button"
                onClick={showTradeModal}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
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
        
        {/* Open Orders Section */}
        <div className="mt-8 card">
          <div className="flex-between mb-6">
            <h2 className="text-lg font-medium text-white">Open Orders</h2>
            <span className="badge badge-primary text-xs">2 Active</span>
          </div>
          
          <div className="table-container">
            <table className="table-main">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Time</th>
                  <th className="table-header-cell">Pair</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Side</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Filled</th>
                  <th className="table-header-cell">Total</th>
                  <th className="table-header-cell text-right">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr className="table-row">
                  <td className="table-cell status-neutral">2023-06-12 14:23</td>
                  <td className="table-cell font-medium text-white">BTC/USDT</td>
                  <td className="table-cell status-neutral">
                    <span className="badge badge-primary text-xs">Limit</span>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-success text-xs">Buy</span>
                  </td>
                  <td className="table-cell text-white">$38,500.00</td>
                  <td className="table-cell text-white">0.05000000</td>
                  <td className="table-cell status-neutral">0%</td>
                  <td className="table-cell text-white">$1,925.00</td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => setDeleteOrderModal({ isOpen: true, orderId: '12345' })}
                      className="text-error hover:text-red-300 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-cell status-neutral">2023-06-11 09:45</td>
                  <td className="table-cell font-medium text-white">ETH/USDT</td>
                  <td className="table-cell status-neutral">
                    <span className="badge badge-primary text-xs">Limit</span>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-error text-xs">Sell</span>
                  </td>
                  <td className="table-cell text-white">$2,400.00</td>
                  <td className="table-cell text-white">1.50000000</td>
                  <td className="table-cell status-neutral">0%</td>
                  <td className="table-cell text-white">$3,600.00</td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => setDeleteOrderModal({ isOpen: true, orderId: '12346' })}
                      className="text-error hover:text-red-300 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Empty State when no orders */}
          {/* <div className="text-center py-12">
            <div className="text-gradient-secondary mb-4">
              <TrendingUpIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No open orders</p>
              <p className="text-sm">Your active orders will appear here</p>
            </div>
          </div> */}
        </div>

        {/* Account Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">$10,245.67</div>
            <div className="text-sm text-gradient-secondary">Account Balance</div>
            <div className="text-xs text-success mt-1">+2.45% Today</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">$1,925.00</div>
            <div className="text-sm text-gradient-secondary">Open Orders</div>
            <div className="text-xs text-gradient-secondary mt-1">2 Active Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">$125.30</div>
            <div className="text-sm text-gradient-secondary">Today's P&L</div>
            <div className="text-xs text-success mt-1">+1.25%</div>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="mt-8 card">
          <h3 className="text-lg font-medium text-white mb-4">Trading Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Risk Management</h4>
                <p className="text-gradient-secondary text-sm">
                  Never risk more than 2% of your account balance on a single trade. Use stop-loss orders to limit downside risk.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Market Analysis</h4>
                <p className="text-gradient-secondary text-sm">
                  Combine technical and fundamental analysis. Check volume, support/resistance levels, and market news.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Order Types</h4>
                <p className="text-gradient-secondary text-sm">
                  Use limit orders for better price control and market orders for immediate execution during volatile periods.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Account Rules</h4>
                <p className="text-gradient-secondary text-sm">
                  Follow your funded account rules: maximum daily loss, profit targets, and position sizing requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modals */}
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
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Cancel Order"
          cancelText="Keep Order"
          type="danger"
        />
      </div>
    </div>
  );
}
