'use client';

import React, { useEffect, useState, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectMarketPair } from '@/store/slices/marketSlice';
import { useGetAllMarketPairsQuery, useGetOrderBookQuery, useGetRecentTradesQuery } from '@/services/spotService';
import SpotTradingView from '@/components/trading/SpotTradingView';
import OrderBook from '@/components/trading/OrderBook';
import TradeHistory from '@/components/trading/TradeHistory';
import MarketSelector from '@/components/trading/MarketSelector';
import SpotOrderForm from '@/components/trading/SpotOrderForm';
import OpenOrders from '@/components/trading/OpenOrders';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const STATIC_MARKET_DATA = {
  pairs: {
    'BTC/USDT': {
      symbol: 'BTC/USDT',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      lastPrice: '41275.50',
      priceChangePercent: '2.34',
      high: '41890.00',
      low: '40125.75',
      volume: '1245.67',
    },
    'ETH/USDT': {
      symbol: 'ETH/USDT',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      lastPrice: '2247.75',
      priceChangePercent: '1.56',
      high: '2285.50',
      low: '2195.25',
      volume: '15876.32',
    },
    'SOL/USDT': {
      symbol: 'SOL/USDT',
      baseAsset: 'SOL',
      quoteAsset: 'USDT',
      lastPrice: '145.38',
      priceChangePercent: '4.21',
      high: '149.75',
      low: '139.20',
      volume: '42568.91',
    },
    'BNB/USDT': {
      symbol: 'BNB/USDT',
      baseAsset: 'BNB',
      quoteAsset: 'USDT',
      lastPrice: '487.65',
      priceChangePercent: '-0.78',
      high: '495.40',
      low: '482.10',
      volume: '8765.43',
    },
    'XRP/USDT': {
      symbol: 'XRP/USDT',
      baseAsset: 'XRP',
      quoteAsset: 'USDT',
      lastPrice: '0.5642',
      priceChangePercent: '-1.23',
      high: '0.5780',
      low: '0.5590',
      volume: '45678.90',
    }
  },
  orderBook: {
    bids: [
      ['41260.50', '0.12345'],
      ['41259.00', '0.25000'],
      ['41258.75', '0.18700'],
      ['41257.25', '0.32100'],
      ['41256.00', '0.45000'],
      ['41255.50', '0.37800'],
      ['41254.25', '0.29400'],
      ['41253.75', '0.42000'],
      ['41252.50', '0.18500'],
      ['41251.00', '0.51200'],
    ],
    asks: [
      ['41275.50', '0.15600'],
      ['41276.25', '0.22000'],
      ['41277.50', '0.17800'],
      ['41278.75', '0.31200'],
      ['41280.00', '0.28000'],
      ['41281.25', '0.19500'],
      ['41282.50', '0.36700'],
      ['41283.75', '0.24300'],
      ['41285.00', '0.40100'],
      ['41286.25', '0.15800'],
    ]
  },
  recentTrades: [
    { id: 'trade1', price: '41275.50', quantity: '0.0234', time: new Date().toISOString(), isBuyerMaker: false },
    { id: 'trade2', price: '41274.25', quantity: '0.0187', time: new Date(Date.now() - 30000).toISOString(), isBuyerMaker: true },
    { id: 'trade3', price: '41275.00', quantity: '0.0356', time: new Date(Date.now() - 45000).toISOString(), isBuyerMaker: false },
    { id: 'trade4', price: '41273.75', quantity: '0.0128', time: new Date(Date.now() - 60000).toISOString(), isBuyerMaker: true },
    { id: 'trade5', price: '41274.00', quantity: '0.0475', time: new Date(Date.now() - 90000).toISOString(), isBuyerMaker: true },
    { id: 'trade6', price: '41275.25', quantity: '0.0365', time: new Date(Date.now() - 120000).toISOString(), isBuyerMaker: false },
    { id: 'trade7', price: '41275.50', quantity: '0.0211', time: new Date(Date.now() - 150000).toISOString(), isBuyerMaker: false },
    { id: 'trade8', price: '41273.50', quantity: '0.0194', time: new Date(Date.now() - 180000).toISOString(), isBuyerMaker: true },
  ]
};

export default function SpotTradingPage() {
  // const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const selectedPair = useAppSelector((state) => state.market.selectedPair);

  const { data: marketPairs, isLoading: isLoadingPairs, isError: isPairsError } = useGetAllMarketPairsQuery();
  const { data: orderBook, isError: isOrderBookError } = useGetOrderBookQuery(selectedPair || '', { skip: !selectedPair });
  const { data: recentTrades, isError: isTradesError } = useGetRecentTradesQuery({ symbol: selectedPair || '' }, { skip: !selectedPair });

  const effectiveMarketPairs = isPairsError || !marketPairs ? STATIC_MARKET_DATA.pairs : marketPairs;
  const effectiveOrderBook = isOrderBookError || !orderBook ? STATIC_MARKET_DATA.orderBook : orderBook;
  const effectiveRecentTrades = isTradesError || !recentTrades ? STATIC_MARKET_DATA.recentTrades : recentTrades;

  useEffect(() => {
    // const symbolFromUrl = searchParams?.get('symbol');
    const symbolFromUrl = "";
    const defaultPair = Object.keys(effectiveMarketPairs)[0];

    if (symbolFromUrl && symbolFromUrl in effectiveMarketPairs) {
      dispatch(selectMarketPair(symbolFromUrl));
    } else if (!selectedPair && defaultPair) {
      dispatch(selectMarketPair(defaultPair));
    }
  }, [effectiveMarketPairs, selectedPair, dispatch]);

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

  const currentPair = selectedPair
    ? effectiveMarketPairs[selectedPair as keyof typeof effectiveMarketPairs]
    : null;

  const formattedOrderBook = {
    bids: effectiveOrderBook.bids.map(bid => [bid[0], bid[1]] as [string, string]),
    asks: effectiveOrderBook.asks.map(ask => [ask[0], ask[1]] as [string, string])
  };

  return (
    <div className="page-wrapper">
      <Suspense fallback={
        <div className="flex-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <div className="container-custom py-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="heading-secondary text-gradient-muted mb-2">Spot Trading</h1>
            <p className="text-gradient-secondary">Trade cryptocurrencies with your funded account</p>
          </div>

          {/* Market Selector */}
          <div className="mb-6">
            <MarketSelector
              pairs={effectiveMarketPairs}
              selectedPair={selectedPair}
              onSelectPair={(pair) => dispatch(selectMarketPair(pair))}
            />
          </div>

          {currentPair && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Trading Area */}
              <div className="lg:col-span-3">
                {/* Trading Chart */}
                <div className="card mb-6 h-[500px]">
                  <div className="flex-between mb-4">
                    <h3 className="text-lg font-medium text-white">Price Chart</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-light text-white">
                        ${currentPair.lastPrice}
                      </span>
                      <span className={`badge ${parseFloat(currentPair.priceChangePercent) >= 0 ? 'badge-success' : 'badge-error'}`}>
                        {currentPair.priceChangePercent}%
                      </span>
                    </div>
                  </div>
                  <SpotTradingView symbol={currentPair.symbol} />
                </div>

                {/* Order Book and Trade History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="card h-[400px] overflow-hidden">
                    <div className="flex-between mb-4">
                      <h3 className="text-lg font-medium text-white">Order Book</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                          <span className="text-xs text-gradient-secondary">Bids</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                          <span className="text-xs text-gradient-secondary">Asks</span>
                        </div>
                      </div>
                    </div>
                    <OrderBook data={formattedOrderBook} />
                  </div>

                  <div className="card h-[400px] overflow-hidden">
                    <div className="flex-between mb-4">
                      <h3 className="text-lg font-medium text-white">Recent Trades</h3>
                      <span className="text-xs text-gradient-secondary">Last 24h</span>
                    </div>
                    <TradeHistory trades={effectiveRecentTrades || []} />
                  </div>
                </div>

                {/* Open Orders */}
                <div className="card">
                  <div className="flex-between mb-4">
                    <h3 className="text-lg font-medium text-white">Open Orders</h3>
                    <span className="badge badge-primary text-xs">Active</span>
                  </div>
                  <OpenOrders />
                </div>
              </div>

              {/* Trading Panel */}
              <div className="lg:col-span-1">
                <div className="card sticky top-4">
                  <div className="mb-6">
                    <div className="flex-between mb-4">
                      <h3 className="text-lg font-medium text-white">
                        {currentPair.baseAsset}/{currentPair.quoteAsset}
                      </h3>
                      <span className="badge badge-primary text-xs">SPOT</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gradient-secondary mb-1">24h High</div>
                        <div className="text-sm font-medium text-white">${currentPair.high}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gradient-secondary mb-1">24h Low</div>
                        <div className="text-sm font-medium text-white">${currentPair.low}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gradient-secondary mb-1">24h Volume</div>
                        <div className="text-sm font-medium text-white">{currentPair.volume}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gradient-secondary mb-1">Change</div>
                        <div className={`text-sm font-medium ${parseFloat(currentPair.priceChangePercent) >= 0 ? 'status-positive' : 'status-negative'}`}>
                          {currentPair.priceChangePercent}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <SpotOrderForm
                    pair={currentPair}
                    orderBook={effectiveOrderBook}
                  />
                </div>
              </div>
            </div>
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
