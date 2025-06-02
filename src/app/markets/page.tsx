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
    <div className="page-wrapper">
      <div className="container-custom section-padding">
        <div className="flex-between mb-8 mobile-flex gap-4">
          <div>
            <h1 className="heading-secondary text-gradient-muted mb-2">Trading Markets</h1>
            <p className="text-gradient-secondary">Explore available trading pairs for your funded account</p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 w-full md:w-64"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="tab-list mb-8">
            <Tab className={({ selected }) =>
              `tab-button ${selected ? 'tab-button-active' : ''}`
            }>
              Spot Markets
            </Tab>
            <Tab className={({ selected }) =>
              `tab-button ${selected ? 'tab-button-active' : ''}`
            }>
              Perpetual Futures
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel className="tab-content">
              {isLoading ? (
                <div className="flex-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="table-container">
                  <table className="table-main">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Pair</th>
                        <th className="table-header-cell">Price</th>
                        <th className="table-header-cell">24h Change</th>
                        <th className="table-header-cell">24h Volume</th>
                        <th className="table-header-cell text-right">Trade</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {filteredSpotMarkets.length > 0 ? (
                        filteredSpotMarkets.map((market, index) => (
                          <tr key={index} className="table-row">
                            <td className="table-cell font-medium text-white">
                              {market.symbol}
                            </td>
                            <td className="table-cell text-white">
                              ${market.price}
                            </td>
                            <td className={`table-cell font-medium ${market.isPositive ? 'status-positive' : 'status-negative'}`}>
                              {market.change}
                            </td>
                            <td className="table-cell status-neutral">
                              ${market.volume}
                            </td>
                            <td className="table-cell text-right">
                              <Link
                                href={`/spot?symbol=${market.symbol}`}
                                className="btn-ghost"
                              >
                                Trade
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="table-cell text-center status-neutral py-8">
                            No markets found for "{searchQuery}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
              
            <Tab.Panel className="tab-content">
              {isLoading ? (
                <div className="flex-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="table-container">
                  <table className="table-main">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Pair</th>
                        <th className="table-header-cell">Price</th>
                        <th className="table-header-cell">24h Change</th>
                        <th className="table-header-cell">Funding Rate</th>
                        <th className="table-header-cell">24h Volume</th>
                        <th className="table-header-cell text-right">Trade</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {filteredPerpetualMarkets.length > 0 ? (
                        filteredPerpetualMarkets.map((market, index) => (
                          <tr key={index} className="table-row">
                            <td className="table-cell font-medium text-white">
                              {market.symbol}
                            </td>
                            <td className="table-cell text-white">
                              ${market.price}
                            </td>
                            <td className={`table-cell font-medium ${market.isPositive ? 'status-positive' : 'status-negative'}`}>
                              {market.change}
                            </td>
                            <td className={`table-cell font-medium ${market.fundingRate.startsWith('+') ? 'status-positive' : 'status-negative'}`}>
                              {market.fundingRate}
                            </td>
                            <td className="table-cell status-neutral">
                              ${market.volume}
                            </td>
                            <td className="table-cell text-right">
                              <Link
                                href={`/perpetual?symbol=${market.symbol}`}
                                className="btn-ghost"
                              >
                                Trade
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="table-cell text-center status-neutral py-8">
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

        {/* Market Stats */}
        <div className="mt-12">
          <h2 className="heading-tertiary text-gradient-muted mb-6">Market Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">125+</div>
              <div className="text-sm text-gradient-secondary">Trading Pairs</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">$2.4B</div>
              <div className="text-sm text-gradient-secondary">24h Volume</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">0.1%</div>
              <div className="text-sm text-gradient-secondary">Trading Fee</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-light text-gradient-primary mb-2">24/7</div>
              <div className="text-sm text-gradient-secondary">Market Hours</div>
            </div>
          </div>
        </div>

        {/* Trading Info */}
        <div className="mt-8 card">
          <h3 className="text-lg font-medium text-white mb-4">Trading Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-brand mb-2">Spot Trading</h4>
              <p className="text-gradient-secondary text-sm">
                Trade cryptocurrencies directly with instant settlement. Perfect for portfolio building and long-term strategies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand mb-2">Perpetual Futures</h4>
              <p className="text-gradient-secondary text-sm">
                Trade with leverage up to 100x on perpetual contracts with no expiry date. Advanced risk management tools included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
