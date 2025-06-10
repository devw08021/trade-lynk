'use client';

import React, { useState } from 'react';
import { ChartBarIcon, AdjustmentsHorizontalIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface SpotTradingViewProps {
  symbol: string;
}

const timeframes = [
  { label: '1M', value: '1m' },
  { label: '5M', value: '5m' },
  { label: '15M', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d', active: true },
  { label: '1W', value: '1w' },
];

const chartTypes = [
  { label: 'Candlestick', value: 'candlestick' },
  { label: 'Line', value: 'line' },
  { label: 'Area', value: 'area' },
];

const indicators = [
  { label: 'MA', value: 'ma' },
  { label: 'EMA', value: 'ema' },
  { label: 'RSI', value: 'rsi' },
  { label: 'MACD', value: 'macd' },
  { label: 'BB', value: 'bollinger' },
];

export default function SpotTradingView({ symbol }: SpotTradingViewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['ma']);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Header */}
      <div className="flex-between mb-4 px-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-medium text-white">{symbol}</h2>
          </div>
          <span className="badge badge-primary text-xs">Live</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex space-x-1">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedChartType(type.value)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${selectedChartType === type.value
                    ? 'bg-brand text-black'
                    : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md bg-[#2a2b2e] text-gradient-secondary hover:text-white transition-colors"
            title="Toggle fullscreen"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex-between mb-4 px-2">
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedTimeframe(tf.value)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${selectedTimeframe === tf.value
                  ? 'bg-brand text-black'
                  : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Technical Indicators */}
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-gradient-secondary" />
          <div className="flex space-x-1">
            {indicators.map((indicator) => (
              <button
                key={indicator.value}
                onClick={() => toggleIndicator(indicator.value)}
                className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${selectedIndicators.includes(indicator.value)
                    ? 'bg-brand text-black'
                    : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
                  }`}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow w-full bg-[#08090a] rounded-lg border border-[#2a2b2e] relative overflow-hidden">
        {/* Chart Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Horizontal lines */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-600"
              style={{ top: `${i * 10}%` }}
            ></div>
          ))}
          {/* Vertical lines */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-600"
              style={{ left: `${i * 8.33}%` }}
            ></div>
          ))}
        </div>

        {/* Chart Content */}
        <div className="absolute inset-0 flex-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-medium text-white mb-2">Advanced Trading Chart</h3>
            <p className="text-gradient-secondary mb-4">
              Professional charting powered by TradingView
            </p>
            <div className="space-y-2 text-sm text-gradient-secondary">
              <p>• Real-time price data and candlestick charts</p>
              <p>• 50+ technical indicators and drawing tools</p>
              <p>• Multiple timeframes from 1 minute to 1 month</p>
              <p>• Volume profile and market depth analysis</p>
            </div>

            {/* Mock Price Action */}
            <div className="mt-6 card-dark inline-block">
              <div className="flex items-center space-x-4 text-sm">
                <div>
                  <span className="text-gradient-secondary">Price: </span>
                  <span className="text-white font-medium">$41,275.50</span>
                </div>
                <div>
                  <span className="text-gradient-secondary">24h: </span>
                  <span className="text-success font-medium">+2.34%</span>
                </div>
                <div>
                  <span className="text-gradient-secondary">Vol: </span>
                  <span className="text-white">1.2M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Loading State */}
        {/* Uncomment for loading state
        <div className="absolute inset-0 flex-center bg-[#08090a]/80">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gradient-secondary">Loading chart data...</p>
          </div>
        </div>
        */}

        {/* Price Overlay */}
        <div className="absolute top-4 left-4 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gradient-secondary">O</span>
            <span className="text-sm text-white">41,245.30</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gradient-secondary">H</span>
            <span className="text-sm text-white">41,890.50</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gradient-secondary">L</span>
            <span className="text-sm text-white">41,125.75</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gradient-secondary">C</span>
            <span className="text-sm text-success">41,275.50</span>
          </div>
        </div>

        {/* Volume Bar (Mock) */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end space-x-1 h-12">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-brand/30 rounded-t"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              ></div>
            ))}
          </div>
          <div className="text-xs text-gradient-secondary mt-1">Volume</div>
        </div>
      </div>

      {/* Chart Footer Info */}
      <div className="flex-between my-4 px-2 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gradient-secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <span className="text-gradient-secondary">
            Timeframe: {timeframes.find(tf => tf.value === selectedTimeframe)?.label}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gradient-secondary">Live data</span>
        </div>
      </div>
    </div>
  );
}
