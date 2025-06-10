// components/TradingPanel.tsx
import React from 'react';
import SpotOrderForm from '@/components/trading/SpotOrderForm';
import PairStats from './PairStats';

interface TradingPanelProps {
    currentPair: any;
    orderBook: any;
}

export default function TradingPanel({ currentPair, orderBook }: TradingPanelProps) {
    return (
        <div className="lg:col-span-1">
            <div className="card sticky top-4">
                <div className="mb-6">
                    <div className="flex-between mb-4">
                        <h3 className="text-lg font-medium text-white">
                            {currentPair.baseAsset}/{currentPair.quoteAsset}
                        </h3>
                        <span className="badge badge-primary text-xs">SPOT</span>
                    </div>

                    <PairStats currentPair={currentPair} />
                </div>

                <SpotOrderForm
                    pair={currentPair}
                    orderBook={orderBook}
                />
            </div>
        </div>
    );
}
