'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const STATIC_MARKET_DATA = {
  spot: [
    { symbol: 'BTC/USDT', price: '41275.50', change: '+2.34%', volume: '1,245,678,900', isPositive: true },
    { symbol: 'ETH/USDT', price: '2247.75', change: '+1.56%', volume: '782,456,300', isPositive: true },
    { symbol: 'SOL/USDT', price: '145.38', change: '+4.21%', volume: '562,345,100', isPositive: true },
    { symbol: 'BNB/USDT', price: '487.65', change: '-0.78%', volume: '321,987,600', isPositive: false },
    { symbol: 'XRP/USDT', price: '0.5642', change: '-1.23%', volume: '289,765,400', isPositive: false },
    { symbol: 'ADA/USDT', price: '0.4532', change: '+0.87%', volume: '198,765,300', isPositive: true },
    { symbol: 'DOGE/USDT', price: '0.1234', change: '+5.67%', volume: '187,654,300', isPositive: true },
    { symbol: 'DOT/USDT', price: '7.8901', change: '-0.45%', volume: '132,456,700', isPositive: false },
    { symbol: 'LINK/USDT', price: '13.5642', change: '+2.12%', volume: '98,765,400', isPositive: true },
    { symbol: 'AVAX/USDT', price: '34.7565', change: '+1.78%', volume: '87,654,300', isPositive: true },
  ],
  perpetual: [
    { symbol: 'BTC-PERP', price: '41289.75', change: '+2.41%', volume: '2,345,678,900', fundingRate: '+0.01%', isPositive: true },
    { symbol: 'ETH-PERP', price: '2249.50', change: '+1.62%', volume: '1,782,456,300', fundingRate: '+0.005%', isPositive: true },
    { symbol: 'SOL-PERP', price: '145.42', change: '+4.25%', volume: '962,345,100', fundingRate: '+0.02%', isPositive: true },
    { symbol: 'BNB-PERP', price: '487.25', change: '-0.82%', volume: '721,987,600', fundingRate: '-0.003%', isPositive: false },
    { symbol: 'XRP-PERP', price: '0.5638', change: '-1.28%', volume: '589,765,400', fundingRate: '-0.01%', isPositive: false },
    { symbol: 'ADA-PERP', price: '0.4528', change: '+0.85%', volume: '398,765,300', fundingRate: '+0.004%', isPositive: true },
    { symbol: 'DOGE-PERP', price: '0.1238', change: '+5.72%', volume: '287,654,300', fundingRate: '+0.015%', isPositive: true },
    { symbol: 'DOT-PERP', price: '7.8850', change: '-0.48%', volume: '232,456,700', fundingRate: '-0.002%', isPositive: false },
    { symbol: 'LINK-PERP', price: '13.5740', change: '+2.15%', volume: '198,765,400', fundingRate: '+0.008%', isPositive: true },
    { symbol: 'AVAX-PERP', price: '34.7825', change: '+1.82%', volume: '187,654,300', fundingRate: '+0.007%', isPositive: true },
  ]
};

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredSpotMarkets = STATIC_MARKET_DATA.spot.filter(market => 
    market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPerpetualMarkets = STATIC_MARKET_DATA.perpetual.filter(market => 
    market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Markets</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search markets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-dark-100 rounded-md bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-dark-200 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Spot Markets
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Perpetual Markets
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          <Tab.Panel>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-dark-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Pair
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Volume
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSpotMarkets.length > 0 ? (
                      filteredSpotMarkets.map((market, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-300">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {market.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${market.price}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${market.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {market.change}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            ${market.volume}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <Link
                              href={`/spot?symbol=${market.symbol}`}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                            >
                              Trade
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No markets found for "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Tab.Panel>
            
          <Tab.Panel>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-dark-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Pair
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Funding Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Volume
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPerpetualMarkets.length > 0 ? (
                      filteredPerpetualMarkets.map((market, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-300">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {market.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${market.price}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${market.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {market.change}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${market.fundingRate.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {market.fundingRate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            ${market.volume}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <Link
                              href={`/perpetual?symbol=${market.symbol}`}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                            >
                              Trade
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No markets found for "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 