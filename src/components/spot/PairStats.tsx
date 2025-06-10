// components/PairStats.tsx
import React from 'react';

interface PairStatsProps {
    currentPair: any;
}

export default function PairStats({ currentPair }: PairStatsProps) {
    return (
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
    );
}
