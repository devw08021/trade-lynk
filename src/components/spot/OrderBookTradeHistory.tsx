// components/OrderBookTradeHistory.tsx
import React from 'react';
import OrderBook from '@/components/trading/OrderBook';
import TradeHistory from '@/components/trading/TradeHistory';

interface OrderBookTradeHistoryProps {
    orderBook: any;
    recentTrades: any[];
}

export default function OrderBookTradeHistory({ orderBook, recentTrades }: OrderBookTradeHistoryProps) {
    const formattedOrderBook = {
        bids: orderBook.bids.map((bid: any) => [bid[0], bid[1]] as [string, string]),
        asks: orderBook.asks.map((ask: any) => [ask[0], ask[1]] as [string, string])
    };

    return (
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
                <TradeHistory trades={recentTrades || []} />
            </div>
        </div>
    );
}
