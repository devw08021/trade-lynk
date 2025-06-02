'use client';

import React from 'react';
import Link from 'next/link';
import { UserCircleIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

interface P2POffer {
  id: string;
  creator: {
    id: string;
    username: string;
    completedTrades: number;
    positiveRating: number;
    accountCreationDate: string;
  };
  type: string; // 'buy' or 'sell'
  asset: string;
  fiatCurrency: string;
  price: string;
  minAmount: string;
  maxAmount: string;
  availableAmount: string;
  paymentMethods: string[];
  terms: string;
  autoReply?: string;
  status: string;//'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface P2POfferListProps {
  offers: P2POffer[];
  tradeType: string; // 'buy' or 'sell'
}

export default function P2POfferList({ offers, tradeType }: P2POfferListProps) {
  return (
    <div className="mt-6">
      <div className="table-container">
        <table className="table-main">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Advertiser</th>
              <th className="table-header-cell">Price</th>
              <th className="table-header-cell">Limit/Available</th>
              <th className="table-header-cell">Payment Method</th>
              <th className="table-header-cell">Terms</th>
              <th className="table-header-cell text-right">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {offers.map((offer) => (
              <tr key={offer.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-[#bfff00]/20 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-brand" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {offer.creator.username}
                      </div>
                      <div className="text-sm text-gradient-secondary flex items-center">
                        <span>{offer.creator.completedTrades} trades</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <StarIcon className="h-4 w-4 status-positive mr-1" />
                          <span className="status-positive">{offer.creator.positiveRating}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="table-cell">
                  <div className="text-sm font-medium text-white">
                    ${offer.price}
                  </div>
                  <div className="text-xs text-gradient-secondary">
                    {offer.fiatCurrency}
                  </div>
                </td>
                
                <td className="table-cell">
                  <div className="text-sm text-white">
                    {offer.minAmount}-{offer.maxAmount} {offer.asset}
                  </div>
                  <div className="text-xs text-gradient-secondary">
                    Available: {offer.availableAmount} {offer.asset}
                  </div>
                </td>
                
                <td className="table-cell">
                  <div className="flex flex-wrap gap-1">
                    {offer.paymentMethods.slice(0, 2).map((method, index) => (
                      <span key={index} className="badge badge-primary text-xs">
                        {method}
                      </span>
                    ))}
                    {offer.paymentMethods.length > 2 && (
                      <span className="badge text-xs bg-[#2a2b2e] text-gray-400 border border-[#2a2b2e]">
                        +{offer.paymentMethods.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="table-cell max-w-xs">
                  <div className="text-sm text-gradient-secondary truncate" title={offer.terms}>
                    {offer.terms}
                  </div>
                </td>
                
                <td className="table-cell text-right">
                  <Link
                    href={`/p2p/trade/${offer.id}`}
                    className={`btn-primary text-sm px-4 py-2 ${
                      tradeType === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''
                    }`}
                  >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {offer.asset}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Offer Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-lg font-light text-gradient-primary mb-1">
            {offers.length}
          </div>
          <div className="text-sm text-gradient-secondary">Active Offers</div>
        </div>
        
        <div className="card text-center">
          <div className="text-lg font-light text-gradient-primary mb-1">
            {Math.round(offers.reduce((sum, offer) => sum + offer.creator.positiveRating, 0) / offers.length)}%
          </div>
          <div className="text-sm text-gradient-secondary">Avg. Rating</div>
        </div>
        
        <div className="card text-center">
          <div className="text-lg font-light text-gradient-primary mb-1">
            ${Math.min(...offers.map(offer => parseFloat(offer.price))).toFixed(2)}
          </div>
          <div className="text-sm text-gradient-secondary">Best Price</div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="mt-6 card">
        <h3 className="text-lg font-medium text-white mb-4">Trading Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
            <div>
              <h4 className="font-medium text-brand text-sm mb-1">Check Trader Reputation</h4>
              <p className="text-gradient-secondary text-sm">
                Always review the trader's completion rate and feedback before initiating a trade.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
            <div>
              <h4 className="font-medium text-brand text-sm mb-1">Read Terms Carefully</h4>
              <p className="text-gradient-secondary text-sm">
                Each offer has specific terms and conditions. Make sure you understand them before trading.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
            <div>
              <h4 className="font-medium text-brand text-sm mb-1">Use Escrow Protection</h4>
              <p className="text-gradient-secondary text-sm">
                All trades are protected by escrow. Never release funds outside the platform.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
            <div>
              <h4 className="font-medium text-brand text-sm mb-1">Communicate Clearly</h4>
              <p className="text-gradient-secondary text-sm">
                Use the chat system to communicate with your trading partner throughout the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
