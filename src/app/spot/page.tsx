'use client';

import React, { Suspense } from 'react';
import { useAppSelector } from '@/store/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import OpenOrders from '@/components/trading/OpenOrders';
import TradingPageHeader from '@/components/spot/Header';
import MarketSelectorSection from '@/components/spot/MarketSelectorSection';
import TradingGrid from '@/components/spot/TradingGrid';
import { useTradingData } from '@/hooks';

export default function SpotTradingPage() {
  const selectedPair = useAppSelector((state) => state.market.selectedPair);
  const {
    effectiveMarketPairs,
    effectiveOrderBook,
    effectiveRecentTrades,
    isLoadingPairs,
    currentPair
  } = useTradingData();

  if (isLoadingPairs && !effectiveMarketPairs) {
    return (
      <div className="page-wrapper flex-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gradient-secondary">Loading trading pairs...</p>
        </div>
      </div>
    );
  }

  if (!effectiveMarketPairs || Object.keys(effectiveMarketPairs).length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container-custom section-padding">
          <div className="alert-error">
            <p>No trading pairs available. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Suspense fallback={
        <div className="flex-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <div className="container-custom py-4">
          <TradingPageHeader />

          <MarketSelectorSection
            pairs={effectiveMarketPairs}
            selectedPair={selectedPair}
          />

          {currentPair && (
            <TradingGrid
              currentPair={currentPair}
              orderBook={effectiveOrderBook}
              recentTrades={effectiveRecentTrades}
            />
          )}

          {/* Trading Statistics */}
          <div className="mt-8">
            <h2 className="heading-tertiary text-gradient-muted mb-6">Trading Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">$2.4M</div>
                <div className="text-sm text-gradient-secondary">24h Volume</div>
              </div>
              <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">156</div>
                <div className="text-sm text-gradient-secondary">Active Pairs</div>
              </div>
              <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">0.1%</div>
                <div className="text-sm text-gradient-secondary">Trading Fee</div>
              </div>
              <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">24/7</div>
                <div className="text-sm text-gradient-secondary">Market Hours</div>
              </div>
            </div>
          </div>

          {/* Trading Information */}
          <div className="mt-8 card">
            <h3 className="text-lg font-medium text-white mb-4">Spot Trading Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-brand mb-2">Account Protection</h4>
                <p className="text-gradient-secondary text-sm">
                  Your funded account is protected with our proprietary risk management system.
                  All trades are monitored in real-time to ensure compliance with trading rules.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-brand mb-2">Instant Execution</h4>
                <p className="text-gradient-secondary text-sm">
                  Experience lightning-fast order execution with our advanced matching engine.
                  Zero slippage on major pairs with deep liquidity pools.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-brand mb-2">Advanced Tools</h4>
                <p className="text-gradient-secondary text-sm">
                  Access professional trading tools including TradingView charts, order book depth,
                  and real-time market data to make informed trading decisions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-brand mb-2">Risk Management</h4>
                <p className="text-gradient-secondary text-sm">
                  Built-in stop-loss and take-profit orders help manage your risk.
                  Position sizing tools ensure you stay within your account limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
