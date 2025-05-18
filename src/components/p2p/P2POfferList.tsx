'use client';

import React from 'react';
import Link from 'next/link';
import { UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface P2POffer {
  id: string;
  creator: {
    id: string;
    username: string;
    completedTrades: number;
    positiveRating: number;
    accountCreationDate: string;
  };
  type: 'buy' | 'sell';
  asset: string;
  fiatCurrency: string;
  price: string;
  minAmount: string;
  maxAmount: string;
  availableAmount: string;
  paymentMethods: string[];
  terms: string;
  autoReply?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface P2POfferListProps {
  offers: P2POffer[];
  tradeType: 'buy' | 'sell';
}

export default function P2POfferList({ offers, tradeType }: P2POfferListProps) {
  return (
    <div className="mt-6">
      <table className="min-w-full bg-white dark:bg-dark-300 divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Advertiser
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Limit/Available
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payment Method
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-300 divide-y divide-gray-200 dark:divide-dark-700">
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-dark-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {offer.creator.username}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <span>{offer.creator.completedTrades} trades</span>
                      <span className="mx-1">•</span>
                      <span className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                        {offer.creator.positiveRating}%
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {offer.price} {offer.fiatCurrency}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {offer.minAmount}-{offer.maxAmount} {offer.asset}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Available: {offer.availableAmount} {offer.asset}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {offer.paymentMethods.slice(0, 2).join(', ')}
                  {offer.paymentMethods.length > 2 && ` +${offer.paymentMethods.length - 2} more`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Link
                  href={`/p2p/trade/${offer.id}`}
                  className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tradeType === 'buy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 