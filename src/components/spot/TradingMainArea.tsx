// components/TradingMainArea.tsx
import React from 'react';
import OpenOrders from '@/components/trading/OpenOrders';
import TradingChart from '@/components/spot/TradingChart';
import OrderBookTradeHistory from '@/components/spot/OrderBookTradeHistory';

interface TradingMainAreaProps {
    currentPair: any;
    orderBook: any;
    recentTrades: any[];
}

export default function TradingMainArea({ currentPair, orderBook, recentTrades }: TradingMainAreaProps) {
    return (
        <div className="lg:col-span-3">
            <TradingChart currentPair={currentPair} />
            <OrderBookTradeHistory orderBook={orderBook} recentTrades={recentTrades} />

            {/* Open Orders */}
            <div className="card">
                <div className="flex-between mb-4">
                    <h3 className="text-lg font-medium text-white">Open Orders</h3>
                    <span className="badge badge-primary text-xs">Active</span>
                </div>
                <OpenOrders />
            </div>
        </div>
    );
}
