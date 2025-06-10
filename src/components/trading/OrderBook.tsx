'use client';

import React, { useState, useMemo } from 'react';
import { AdjustmentsHorizontalIcon, InformationCircleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface OrderBookProps {
  data?: {
    bids?: [string, string][];
    asks?: [string, string][];
  };
  isPerpetual?: boolean;
}

export default function OrderBook({ data, isPerpetual = false }: OrderBookProps) {
  const [precision, setPrecision] = useState(2);
  const [showDepth, setShowDepth] = useState(false);
  const [maxRows, setMaxRows] = useState(10);

  const mockBids = [
    ['39500.50', '0.12345000'],
    ['39499.00', '0.25000000'],
    ['39498.75', '0.18700000'],
    ['39497.25', '0.32100000'],
    ['39496.00', '0.45000000'],
    ['39495.50', '0.15600000'],
    ['39494.25', '0.28900000'],
    ['39493.75', '0.22300000'],
    ['39492.50', '0.37800000'],
    ['39491.00', '0.19500000'],
  ];

  const mockAsks = [
    ['39501.00', '0.15600000'],
    ['39502.50', '0.22000000'],
    ['39503.25', '0.17800000'],
    ['39504.00', '0.31200000'],
    ['39505.50', '0.28000000'],
    ['39506.75', '0.19500000'],
    ['39507.25', '0.36700000'],
    ['39508.00', '0.24300000'],
    ['39509.50', '0.40100000'],
    ['39510.25', '0.15800000'],
  ];

  const bids = data?.bids || mockBids;
  const asks = data?.asks || mockAsks;

  // Calculate cumulative totals for depth visualization
  const processedBids = useMemo(() => {
    let cumulativeAmount = 0;
    return bids.slice(0, maxRows).map(([price, amount]) => {
      cumulativeAmount += parseFloat(amount);
      return {
        price: parseFloat(price),
        amount: parseFloat(amount),
        total: parseFloat(price) * parseFloat(amount),
        cumulative: cumulativeAmount
      };
    });
  }, [bids, maxRows]);

  const processedAsks = useMemo(() => {
    let cumulativeAmount = 0;
    return asks.slice(0, maxRows).reverse().map(([price, amount]) => {
      cumulativeAmount += parseFloat(amount);
      return {
        price: parseFloat(price),
        amount: parseFloat(amount),
        total: parseFloat(price) * parseFloat(amount),
        cumulative: cumulativeAmount
      };
    });
  }, [asks, maxRows]);

  const maxCumulativeBid = Math.max(...processedBids.map(b => b.cumulative));
  const maxCumulativeAsk = Math.max(...processedAsks.map(a => a.cumulative));
  const maxCumulative = Math.max(maxCumulativeBid, maxCumulativeAsk);

  const bestBid = processedBids[0]?.price || 0;
  const bestAsk = processedAsks[processedAsks.length - 1]?.price || 0;
  const spread = bestAsk - bestBid;
  const spreadPercentage = (spread / bestBid) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Header with Controls */}
      <div className="flex-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-white">Order Book</h3>
          <span className="badge badge-primary text-xs">Live</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Precision Control */}
          <select
            value={precision}
            onChange={(e) => setPrecision(parseInt(e.target.value))}
            className="text-xs bg-[#2a2b2e] text-white border border-[#2a2b2e] rounded px-2 py-1"
          >
            <option value={1}>0.1</option>
            <option value={2}>0.01</option>
            <option value={3}>0.001</option>
          </select>

          {/* Depth Toggle */}
          <button
            onClick={() => setShowDepth(!showDepth)}
            className={`p-1.5 rounded transition-colors ${showDepth ? 'bg-brand text-black' : 'bg-[#2a2b2e] text-gradient-secondary hover:text-white'
              }`}
            title="Toggle depth visualization"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </button>

          {/* Rows Control */}
          <select
            value={maxRows}
            onChange={(e) => setMaxRows(parseInt(e.target.value))}
            className="text-xs bg-[#2a2b2e] text-white border border-[#2a2b2e] rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#0f1012] rounded-lg border border-[#2a2b2e]">
        <div className="text-center">
          <div className="text-xs text-gradient-secondary">Best Bid</div>
          <div className="text-sm font-medium status-positive">
            ${bestBid.toFixed(precision)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gradient-secondary">Spread</div>
          <div className="text-sm font-medium text-white">
            ${spread.toFixed(precision)}
          </div>
          <div className="text-xs text-gradient-secondary">
            {spreadPercentage.toFixed(3)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gradient-secondary">Best Ask</div>
          <div className="text-sm font-medium status-negative">
            ${bestAsk.toFixed(precision)}
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-columns-4 text-xs font-medium text-gradient-secondary border-b border-[#2a2b2e] py-2 px-1">
        <div className="text-left">Price ({isPerpetual ? 'USDT' : 'USD'})</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
        {showDepth && <div className="text-right">Depth</div>}
      </div>

      {/* Order Book Content */}
      <div className="overflow-y-auto flex-1 scrollbar-hide">
        {/* Asks (Sell orders) - Red */}
        <div className="space-y-px">
          {processedAsks.map((ask, index) => {
            const depthPercentage = showDepth ? (ask.cumulative / maxCumulative) * 100 : 0;

            return (
              <div
                key={`ask-${index}`}
                className="relative grid grid-cols-4 text-xs py-1.5 px-1 hover:bg-[#1a1b1e] transition-colors cursor-pointer group"
                style={{
                  background: showDepth
                    ? `linear-gradient(to left, rgba(239, 68, 68, 0.1) ${depthPercentage}%, transparent ${depthPercentage}%)`
                    : undefined
                }}
              >
                <div className="text-left status-negative font-medium">
                  ${ask.price.toFixed(precision)}
                </div>
                <div className="text-right text-white font-mono">
                  {ask.amount.toFixed(8)}
                </div>
                <div className="text-right text-gradient-secondary">
                  ${ask.total.toFixed(2)}
                </div>
                {showDepth && (
                  <div className="text-right text-gradient-secondary text-xs">
                    {ask.cumulative.toFixed(4)}
                  </div>
                )}
                {/* Hover tooltip */}
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-[#2a2b2e] text-xs p-2 rounded shadow-lg z-10">
                  <div>Price: ${ask.price.toFixed(precision)}</div>
                  <div>Amount: {ask.amount.toFixed(8)}</div>
                  <div>Value: ${ask.total.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spread Indicator */}
        <div className="py-3 border-y border-[#2a2b2e] text-xs text-center bg-[#0f1012] sticky top-0 z-10">
          <div className="flex-center space-x-2">
            <ArrowsUpDownIcon className="h-4 w-4 text-brand" />
            <span className="font-medium text-white">
              Spread: ${spread.toFixed(precision)} ({spreadPercentage.toFixed(3)}%)
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Bids (Buy orders) - Green */}
        <div className="space-y-px">
          {processedBids.map((bid, index) => {
            const depthPercentage = showDepth ? (bid.cumulative / maxCumulative) * 100 : 0;

            return (
              <div
                key={`bid-${index}`}
                className="relative grid grid-cols-4 text-xs py-1.5 px-1 hover:bg-[#1a1b1e] transition-colors cursor-pointer group"
                style={{
                  background: showDepth
                    ? `linear-gradient(to left, rgba(34, 197, 94, 0.1) ${depthPercentage}%, transparent ${depthPercentage}%)`
                    : undefined
                }}
              >
                <div className="text-left status-positive font-medium">
                  ${bid.price.toFixed(precision)}
                </div>
                <div className="text-right text-white font-mono">
                  {bid.amount.toFixed(8)}
                </div>
                <div className="text-right text-gradient-secondary">
                  ${bid.total.toFixed(2)}
                </div>
                {showDepth && (
                  <div className="text-right text-gradient-secondary text-xs">
                    {bid.cumulative.toFixed(4)}
                  </div>
                )}
                {/* Hover tooltip */}
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-[#2a2b2e] text-xs p-2 rounded shadow-lg z-10">
                  <div>Price: ${bid.price.toFixed(precision)}</div>
                  <div>Amount: {bid.amount.toFixed(8)}</div>
                  <div>Value: ${bid.total.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-[#2a2b2e] pt-2 mt-2">
        <div className="flex-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded"></div>
              <span className="text-gradient-secondary">Bids (Buy)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded"></div>
              <span className="text-gradient-secondary">Asks (Sell)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <InformationCircleIcon className="h-3 w-3 text-gradient-secondary" />
            <span className="text-gradient-secondary">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Market Depth Info */}
      {isPerpetual && (
        <div className="mt-2 p-2 bg-[#0f1012] rounded border border-[#2a2b2e]">
          <div className="text-xs text-gradient-secondary">
            <div className="flex-between">
              <span>Total Bid Volume:</span>
              <span className="text-white">{processedBids.reduce((sum, bid) => sum + bid.amount, 0).toFixed(4)}</span>
            </div>
            <div className="flex-between">
              <span>Total Ask Volume:</span>
              <span className="text-white">{processedAsks.reduce((sum, ask) => sum + ask.amount, 0).toFixed(4)}</span>
            </div>
            <div className="flex-between">
              <span>Bid/Ask Ratio:</span>
              <span className="text-brand">
                {(processedBids.reduce((sum, bid) => sum + bid.amount, 0) /
                  processedAsks.reduce((sum, ask) => sum + ask.amount, 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
