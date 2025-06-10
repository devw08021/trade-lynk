'use client';

import React, { useState } from 'react';
import { ClockIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function OpenOrders() {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  const mockOrders = [
    {
      id: '123456',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      price: '39500.00',
      amount: '0.12500000',
      filled: '0.00000000',
      total: '4937.50',
      date: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      status: 'open',
      fillPercentage: 0,
    },
    {
      id: '123457',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'limit',
      price: '2250.00',
      amount: '1.50000000',
      filled: '0.75000000',
      total: '3375.00',
      date: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      status: 'partially_filled',
      fillPercentage: 50,
    },
    {
      id: '123458',
      symbol: 'SOL/USDT',
      side: 'buy',
      type: 'stop_limit',
      price: '145.50',
      amount: '25.00000000',
      filled: '0.00000000',
      total: '3637.50',
      date: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      status: 'open',
      fillPercentage: 0,
    },
  ];

  const filteredOrders = mockOrders.filter(order =>
    filter === 'all' || order.side === filter
  );

  const handleCancelOrder = (orderId: string) => {
    // In a real app, this would call an API to cancel the order
    console.log('Cancelling order:', orderId);
    // You could show a confirmation modal here
  };

  if (mockOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gradient-secondary mb-4">
          <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">No open orders</p>
          <p className="text-sm">Your active orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Order Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${filter === 'all' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
              }`}
          >
            All Orders ({mockOrders.length})
          </button>
          <button
            onClick={() => setFilter('buy')}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${filter === 'buy' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
              }`}
          >
            Buy Orders ({mockOrders.filter(o => o.side === 'buy').length})
          </button>
          <button
            onClick={() => setFilter('sell')}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${filter === 'sell' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
              }`}
          >
            Sell Orders ({mockOrders.filter(o => o.side === 'sell').length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gradient-secondary">Auto-refresh:</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Orders Table */}
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
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell text-right">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="table-row">
                <td className="table-cell">
                  <div className="text-sm text-white">
                    {new Date(order.date).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-gradient-secondary">
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-brand/20 rounded-full flex-center mr-2">
                      <span className="text-brand font-bold text-xs">
                        {order.symbol.split('/')[0][0]}
                      </span>
                    </div>
                    <span className="font-medium text-white">{order.symbol}</span>
                  </div>
                </td>

                <td className="table-cell">
                  <span className="badge badge-primary text-xs capitalize">
                    {order.type.replace('_', ' ')}
                  </span>
                </td>

                <td className="table-cell">
                  <span className={`badge text-xs capitalize ${order.side === 'buy' ? 'badge-success' : 'badge-error'
                    }`}>
                    {order.side}
                  </span>
                </td>

                <td className="table-cell">
                  <div className="text-sm text-white font-medium">
                    ${parseFloat(order.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8
                    })}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="text-sm text-white">
                    {parseFloat(order.amount).toFixed(8)}
                  </div>
                  <div className="text-xs text-gradient-secondary">
                    {order.symbol.split('/')[0]}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="space-y-1">
                    <div className="text-sm text-white">
                      {parseFloat(order.filled).toFixed(8)}
                    </div>
                    {order.fillPercentage > 0 && (
                      <div className="w-full bg-[#2a2b2e] rounded-full h-1">
                        <div
                          className="bg-brand h-1 rounded-full transition-all duration-300"
                          style={{ width: `${order.fillPercentage}%` }}
                        ></div>
                      </div>
                    )}
                    <div className="text-xs text-gradient-secondary">
                      {order.fillPercentage}% filled
                    </div>
                  </div>
                </td>

                <td className="table-cell">
                  <div className="text-sm text-white font-medium">
                    ${parseFloat(order.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-xs text-gradient-secondary">USDT</div>
                </td>

                <td className="table-cell">
                  <div className="flex items-center">
                    {order.status === 'open' && (
                      <>
                        <ClockIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="badge badge-warning text-xs">Open</span>
                      </>
                    )}
                    {order.status === 'partially_filled' && (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="badge badge-info text-xs">Partial</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="table-cell text-right">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="btn-ghost text-xs text-error hover:text-red-300 flex items-center"
                    title="Cancel order"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary */}
      <div className="card-dark">
        <h4 className="font-medium text-white mb-3">Order Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gradient-secondary block">Total Orders</span>
            <span className="text-white font-medium">{mockOrders.length}</span>
          </div>
          <div>
            <span className="text-gradient-secondary block">Buy Orders</span>
            <span className="text-success font-medium">
              {mockOrders.filter(o => o.side === 'buy').length}
            </span>
          </div>
          <div>
            <span className="text-gradient-secondary block">Sell Orders</span>
            <span className="text-error font-medium">
              {mockOrders.filter(o => o.side === 'sell').length}
            </span>
          </div>
          <div>
            <span className="text-gradient-secondary block">Total Value</span>
            <span className="text-white font-medium">
              ${mockOrders.reduce((sum, order) => sum + parseFloat(order.total), 0).toLocaleString(undefined, {
                minimumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="card-dark">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-white mb-2">Order Management Tips</h4>
            <ul className="text-sm text-gradient-secondary space-y-1">
              <li>• Monitor your open orders regularly, especially during volatile market conditions</li>
              <li>• Consider using stop-loss orders to manage risk automatically</li>
              <li>• Partially filled orders can be cancelled to adjust your position</li>
              <li>• Order execution depends on market conditions and liquidity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
