'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';

interface MarketSelectorProps {
  pairs: Record<string, any>;
  selectedPair: string | null;
  onSelectPair: (pair: string) => void;
  type?: 'spot' | 'perpetual';
}

export default function MarketSelector({
  pairs,
  selectedPair,
  onSelectPair,
  type = 'spot'
}: MarketSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');

  const filteredPairs = Object.entries(pairs).filter(([symbol]) =>
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPairs = [...filteredPairs].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(b[1]?.lastPrice || '0') - parseFloat(a[1]?.lastPrice || '0');
      case 'change':
        return parseFloat(b[1]?.priceChangePercent || '0') - parseFloat(a[1]?.priceChangePercent || '0');
      default:
        return a[0].localeCompare(b[0]);
    }
  });

  return (
    <div className="card">
      <div className="flex-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-1">
            {type === 'spot' ? 'Spot Markets' : 'Perpetual Markets'}
          </h2>
          <p className="text-sm text-gradient-secondary">
            {Object.keys(pairs).length} trading pairs available
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Options */}
          <div className="flex space-x-1">
            <button
              onClick={() => setSortBy('symbol')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${sortBy === 'symbol' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                }`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${sortBy === 'price' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                }`}
            >
              Price
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${sortBy === 'change' ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                }`}
            >
              Change
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-8 w-48 text-sm"
            />
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {sortedPairs.length > 0 ? (
          sortedPairs.map(([symbol, data]) => {
            const priceChange = parseFloat(data?.priceChangePercent || '0');
            const isPositive = priceChange >= 0;

            return (
              <button
                key={symbol}
                onClick={() => onSelectPair(symbol)}
                className={`p-3 rounded-lg text-left transition-all transform hover:scale-105 ${selectedPair === symbol
                    ? 'bg-brand/20 border-2 border-brand'
                    : 'card-hover border border-[#2a2b2e]'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${selectedPair === symbol ? 'text-brand' : 'text-white'
                    }`}>
                    {symbol}
                  </span>
                  {/* {isPositive ? (
                    <TrendingUpIcon className="h-3 w-3 status-positive" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 status-negative" />
                  )} */}
                </div>

                {data?.lastPrice && (
                  <div className="space-y-1">
                    <div className={`text-xs font-medium ${selectedPair === symbol ? 'text-white' : 'text-gradient-secondary'
                      }`}>
                      ${parseFloat(data.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8
                      })}
                    </div>

                    <div className={`text-xs font-medium ${isPositive ? 'status-positive' : 'status-negative'
                      }`}>
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </div>
                  </div>
                )}

                {data?.volume && (
                  <div className="text-xs text-gradient-secondary mt-1">
                    Vol: {parseFloat(data.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-gradient-secondary">
              <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No markets found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          </div>
        )}
      </div>

      {/* Market Statistics */}
      <div className="mt-6 pt-6 border-t border-[#2a2b2e]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm font-light text-gradient-primary mb-1">
              {Object.keys(pairs).length}
            </div>
            <div className="text-xs text-gradient-secondary">Total Pairs</div>
          </div>

          <div className="text-center">
            <div className="text-sm font-light text-gradient-primary mb-1">
              {sortedPairs.filter(([, data]) => parseFloat(data?.priceChangePercent || '0') > 0).length}
            </div>
            <div className="text-xs text-gradient-secondary">Gainers</div>
          </div>

          <div className="text-center">
            <div className="text-sm font-light text-gradient-primary mb-1">
              {sortedPairs.filter(([, data]) => parseFloat(data?.priceChangePercent || '0') < 0).length}
            </div>
            <div className="text-xs text-gradient-secondary">Losers</div>
          </div>

          <div className="text-center">
            <div className="text-sm font-light text-gradient-primary mb-1">
              ${sortedPairs.reduce((total, [, data]) =>
                total + parseFloat(data?.volume || '0') * parseFloat(data?.lastPrice || '0'), 0
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gradient-secondary">24h Volume</div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-gradient-secondary">Quick filters:</span>
        {['BTC', 'ETH', 'USDT', 'USD'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSearchQuery(filter)}
            className="badge badge-primary text-xs hover:bg-brand hover:text-black transition-colors"
          >
            {filter} pairs
          </button>
        ))}
        <button
          onClick={() => setSearchQuery('')}
          className="badge text-xs bg-[#2a2b2e] text-gray-400 border border-[#2a2b2e] hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
