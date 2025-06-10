// components/TradingChart.tsx
import React from 'react';
import SpotTradingView from '@/components/trading/SpotTradingView';

interface TradingChartProps {
    currentPair: any;
}

export default function TradingChart({ currentPair }: TradingChartProps) {
    return (
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
    );
}
