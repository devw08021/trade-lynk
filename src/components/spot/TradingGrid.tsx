// components/TradingGrid.tsx
import React from 'react';
import TradingMainArea from './TradingMainArea';
import TradingPanel from './TradingPanel';

interface TradingGridProps {
    currentPair: any;
    orderBook: any;
    recentTrades: any[];
}

export default function TradingGrid({ currentPair, orderBook, recentTrades }: TradingGridProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <TradingMainArea
                currentPair={currentPair}
                orderBook={orderBook}
                recentTrades={recentTrades}
            />
            <TradingPanel
                currentPair={currentPair}
                orderBook={orderBook}
            />
        </div>
    );
}
