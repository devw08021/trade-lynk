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
  }, [effectiveMarketPairs, selectedPair]);


  if (isLoadingPairs && !effectiveMarketPairs) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!effectiveMarketPairs || Object.keys(effectiveMarketPairs).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-700 dark:text-red-400">
            No trading pairs available. Please try again later.
          </p>
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
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <div className="container-custom py-4">

        <div className="mb-4">
          <MarketSelector
            pairs={effectiveMarketPairs}
            selectedPair={selectedPair}
            onSelectPair={(pair) => dispatch(selectMarketPair(pair))}
          />
        </div>


        {currentPair && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="card mb-4 h-[500px]">
                <SpotTradingView symbol={currentPair.symbol} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="card h-[400px] overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Book</h3>
                  <OrderBook data={formattedOrderBook} />
                </div>

                <div className="card h-[400px] overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Trades</h3>
                  <TradeHistory trades={effectiveRecentTrades || []} />
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Open Orders</h3>
                <OpenOrders />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  {currentPair.baseAsset}/{currentPair.quoteAsset}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentPair.lastPrice}
                    </span>
                    <span className={`ml-2 text-sm font-medium ${parseFloat(currentPair.priceChangePercent) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      {currentPair.priceChangePercent}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>24h High: {currentPair.high}</div>
                    <div>24h Low: {currentPair.low}</div>
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

      </div>
    </Suspense>
  );
} 