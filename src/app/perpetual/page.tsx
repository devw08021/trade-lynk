'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectMarketPair } from '@/store/slices/marketSlice';
import { useGetPerpetualPairsQuery, useGetPerpetualMarkPriceQuery, useGetPositionQuery } from '@/services/perpetualService';
import PerpetualTradingView from '@/components/trading/PerpetualTradingView';
import OrderBook from '@/components/trading/OrderBook';
import TradeHistory from '@/components/trading/TradeHistory';
import MarketSelector from '@/components/trading/MarketSelector';
import PerpetualOrderForm from '@/components/trading/PerpetualOrderForm';
import PositionInfo from '@/components/trading/PositionInfo';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LeverageSelector from '@/components/trading/LeverageSelector';
import { Tab } from '@headlessui/react';

const STATIC_MARKET_DATA = {
  pairs: {
    'BTC-PERP': {
      symbol: 'BTC-PERP',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      markPrice: '41289.75',
      indexPrice: '41285.50',
      priceChangePercent: '2.41',
      high24h: '41950.25',
      low24h: '40125.50',
      volume24h: '2345.67',
      openInterest: '1257.89',
      maxLeverage: 100,
      lastFundingRate: '0.01%',
      nextFundingTime: new Date(Date.now() + 3600000).toISOString(),
    },
    'ETH-PERP': {
      symbol: 'ETH-PERP',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      markPrice: '2249.50',
      indexPrice: '2248.25',
      priceChangePercent: '1.62',
      high24h: '2285.75',
      low24h: '2195.50',
      volume24h: '32456.78',
      openInterest: '18765.43',
      maxLeverage: 75,
      lastFundingRate: '0.005%',
      nextFundingTime: new Date(Date.now() + 3600000).toISOString(),
    },
    'SOL-PERP': {
      symbol: 'SOL-PERP',
      baseAsset: 'SOL',
      quoteAsset: 'USDT',
      markPrice: '145.42',
      indexPrice: '145.38',
      priceChangePercent: '4.25',
      high24h: '149.85',
      low24h: '139.25',
      volume24h: '156789.32',
      openInterest: '78945.61',
      maxLeverage: 50,
      lastFundingRate: '0.02%',
      nextFundingTime: new Date(Date.now() + 3600000).toISOString(),
    },
    'BNB-PERP': {
      symbol: 'BNB-PERP',
      baseAsset: 'BNB',
      quoteAsset: 'USDT',
      markPrice: '487.25',
      indexPrice: '487.10',
      priceChangePercent: '-0.82',
      high24h: '495.50',
      low24h: '482.25',
      volume24h: '42356.78',
      openInterest: '15678.90',
      maxLeverage: 50,
      lastFundingRate: '-0.003%',
      nextFundingTime: new Date(Date.now() + 3600000).toISOString(),
    },
    'XRP-PERP': {
      symbol: 'XRP-PERP',
      baseAsset: 'XRP',
      quoteAsset: 'USDT',
      markPrice: '0.5638',
      indexPrice: '0.5635',
      priceChangePercent: '-1.28',
      high24h: '0.5785',
      low24h: '0.5585',
      volume24h: '3456789.12',
      openInterest: '1234567.89',
      maxLeverage: 25,
      lastFundingRate: '-0.01%',
      nextFundingTime: new Date(Date.now() + 3600000).toISOString(),
    },
  },
  orderBook: {
    bids: [
      ['41280.75', '0.12345'],
      ['41279.50', '0.25000'],
      ['41278.25', '0.18700'],
      ['41277.00', '0.32100'],
      ['41276.25', '0.45000'],
      ['41275.50', '0.37800'],
      ['41274.75', '0.29400'],
      ['41273.50', '0.42000'],
      ['41272.25', '0.18500'],
      ['41271.00', '0.51200'],
    ],
    asks: [
      ['41290.50', '0.15600'],
      ['41291.75', '0.22000'],
      ['41293.00', '0.17800'],
      ['41294.25', '0.31200'],
      ['41295.50', '0.28000'],
      ['41296.75', '0.19500'],
      ['41298.00', '0.36700'],
      ['41299.25', '0.24300'],
      ['41300.50', '0.40100'],
      ['41301.75', '0.15800'],
    ]
  },
  recentTrades: [
    { id: 'perp1', price: '41289.75', quantity: '0.0534', time: new Date().toISOString(), isBuyerMaker: false },
    { id: 'perp2', price: '41288.50', quantity: '0.0287', time: new Date(Date.now() - 25000).toISOString(), isBuyerMaker: true },
    { id: 'perp3', price: '41289.25', quantity: '0.0456', time: new Date(Date.now() - 40000).toISOString(), isBuyerMaker: false },
    { id: 'perp4', price: '41287.75', quantity: '0.0328', time: new Date(Date.now() - 55000).toISOString(), isBuyerMaker: true },
    { id: 'perp5', price: '41288.00', quantity: '0.0675', time: new Date(Date.now() - 80000).toISOString(), isBuyerMaker: true },
    { id: 'perp6', price: '41289.50', quantity: '0.0465', time: new Date(Date.now() - 110000).toISOString(), isBuyerMaker: false },
    { id: 'perp7', price: '41290.00', quantity: '0.0311', time: new Date(Date.now() - 140000).toISOString(), isBuyerMaker: false },
    { id: 'perp8', price: '41287.50', quantity: '0.0494', time: new Date(Date.now() - 170000).toISOString(), isBuyerMaker: true },
  ],
  markPrice: {
    markPrice: '41289.75',
    indexPrice: '41285.50',
    fundingRate: '0.01%',
  },
  position: {
    id: 'pos1',
    symbol: 'BTC-PERP',
    side: 'long',
    size: '0.1',
    entryPrice: '40950.25',
    markPrice: '41289.75',
    liquidationPrice: '38450.50',
    margin: '409.50',
    leverage: 10,
    unrealizedPnl: '33.95',
    unrealizedPnlPercent: '0.83',
    marginRatio: '0.15',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

export default function PerpetualTradingPage() {
  const dispatch = useAppDispatch();
  const selectedPair = useAppSelector((state) => state.market.selectedPair);
  const [leverage, setLeverage] = useState(5);

  const { data: perpetualPairs, isLoading: isLoadingPairs, isError: isPairsError } = useGetPerpetualPairsQuery();
  const { data: markPrice, isError: isMarkPriceError } = useGetPerpetualMarkPriceQuery(selectedPair || '', { skip: !selectedPair });
  const { data: position, isError: isPositionError } = useGetPositionQuery(selectedPair || '', { skip: !selectedPair });

  const effectivePerpetualPairs = isPairsError || !perpetualPairs ? STATIC_MARKET_DATA.pairs : perpetualPairs;
  const effectiveMarkPrice = isMarkPriceError || !markPrice ? STATIC_MARKET_DATA.markPrice : markPrice;
  const effectivePosition = isPositionError || !position ? STATIC_MARKET_DATA.position : position;

  // useEffect(() => {
  //   const symbolFromUrl = searchParams?.get('symbol');

  //   // if (symbolFromUrl && effectivePerpetualPairs && Object.keys(effectivePerpetualPairs).length > 0 && effectivePerpetualPairs[symbolFromUrl]) {
  //   //   dispatch(selectMarketPair(symbolFromUrl));
  //   // } else if (effectivePerpetualPairs && Object.keys(effectivePerpetualPairs).length > 0 && !selectedPair) {
  //   //   dispatch(selectMarketPair(Object.keys(effectivePerpetualPairs)[0]));
  //   // }

  //   if (symbolFromUrl && effectivePerpetualPairs && symbolFromUrl in effectivePerpetualPairs) {
  //     dispatch(selectMarketPair(symbolFromUrl));
  //   } else if (effectivePerpetualPairs && Object.keys(effectivePerpetualPairs).length > 0 && !selectedPair) {
  //     dispatch(selectMarketPair(Object.keys(effectivePerpetualPairs)[0]));
  //   }

  // }, [searchParams, effectivePerpetualPairs, selectedPair, dispatch]);


  useEffect(() => {
    const symbolFromUrl = "";
    const defaultPair = Object.keys(effectivePerpetualPairs)[0];

    if (symbolFromUrl && symbolFromUrl in effectivePerpetualPairs) {
      dispatch(selectMarketPair(symbolFromUrl));
    } else if (!selectedPair && defaultPair) {
      dispatch(selectMarketPair(defaultPair));
    }
  }, [ effectivePerpetualPairs, selectedPair]);

  if (isLoadingPairs && !effectivePerpetualPairs) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!effectivePerpetualPairs || Object.keys(effectivePerpetualPairs).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-700 dark:text-red-400">
            No perpetual trading pairs available. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const currentPair = selectedPair
    ? effectivePerpetualPairs[selectedPair as keyof typeof effectivePerpetualPairs]
    : null;





  const formattedOrderBook = {
    bids: STATIC_MARKET_DATA.orderBook.bids.map(bid => [bid[0], bid[1]] as [string, string]),
    asks: STATIC_MARKET_DATA.orderBook.asks.map(ask => [ask[0], ask[1]] as [string, string])
  };

  return (
    <Suspense fallback={<LoadingSpinner size="sm" />}>
      <div className="container-custom py-4">

        <div className="mb-4">
          <MarketSelector
            pairs={effectivePerpetualPairs}
            selectedPair={selectedPair}
            onSelectPair={(pair) => dispatch(selectMarketPair(pair))}
            type="perpetual"
          />
        </div>

        {currentPair && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              {effectivePosition && (
                <div className="card mb-4">
                  <PositionInfo position={effectivePosition} markPrice={effectiveMarkPrice} />
                </div>
              )}

              <div className="card mb-4 h-[500px]">
                <PerpetualTradingView symbol={currentPair.symbol} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="card h-[400px] overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Book</h3>
                  <OrderBook data={formattedOrderBook} isPerpetual={true} />
                </div>

                <div className="card h-[400px] overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Trades</h3>
                  <TradeHistory trades={STATIC_MARKET_DATA.recentTrades} isPerpetual={true} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentPair.baseAsset}/{currentPair.quoteAsset}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="block">Max Leverage: {currentPair.maxLeverage}x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentPair.markPrice}
                    </span>
                    <span className={`ml-2 text-sm font-medium ${parseFloat(currentPair.priceChangePercent) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      {currentPair.priceChangePercent}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>24h High: {currentPair.high24h}</div>
                    <div>24h Low: {currentPair.low24h}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Mark Price: {effectiveMarkPrice?.markPrice || currentPair.markPrice}</span>
                    <span>Index Price: {effectiveMarkPrice?.indexPrice || currentPair.indexPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Funding Rate: {effectiveMarkPrice?.fundingRate || currentPair.lastFundingRate}</span>
                    <span>Next Funding: {new Date(currentPair.nextFundingTime).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <LeverageSelector
                    value={leverage}
                    onChange={setLeverage}
                    maxLeverage={currentPair.maxLeverage}
                    symbol={currentPair.symbol}
                  />
                </div>

                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-dark-200 p-1 mb-4">
                    <Tab className={({ selected }) =>
                      `w-full rounded-lg py-2 text-sm font-medium leading-5 
                    ${selected
                        ? 'bg-white dark:bg-dark-300 shadow text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-400'
                      }`
                    }>
                      Long
                    </Tab>
                    <Tab className={({ selected }) =>
                      `w-full rounded-lg py-2 text-sm font-medium leading-5 
                    ${selected
                        ? 'bg-white dark:bg-dark-300 shadow text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-red-600 dark:hover:text-red-400'
                      }`
                    }>
                      Short
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <PerpetualOrderForm
                        pair={currentPair}
                        leverage={leverage}
                        side="long"
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <PerpetualOrderForm
                        pair={currentPair}
                        leverage={leverage}
                        side="short"
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
        )}

      </div>
    </Suspense >
  );
} 