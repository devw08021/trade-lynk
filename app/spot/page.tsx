'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import MarketInfo from '../../components/MarketInfo';
import PriceChart from '../../components/PriceChart';
import OrderForm from '../../components/OrderForm';
import OrderBookComponent from '../../components/OrderBook';
import RecentTrades from '../../components/RecentTrades';
import OpenOrders from '../../components/OpenOrders';
import { fetchMarketData, fetchOrderBook, fetchRecentTrades, fetchOpenOrders, MarketData, OrderBook, Trade, OpenOrder } from '../../lib/api';

export default function SpotTradingPage() {
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop'>('limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [orderBookData, setOrderBookData] = useState<OrderBook>({ asks: [], bids: [] });
  const [tradesData, setTradesData] = useState<Trade[]>([]);
  const [ordersData, setOrdersData] = useState<OpenOrder[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [market, orderBook, trades, orders] = await Promise.all([
          fetchMarketData(),
          fetchOrderBook(),
          fetchRecentTrades(),
          fetchOpenOrders(),
        ]);
        setMarketData(market);
        setOrderBookData(orderBook);
        setTradesData(trades);
        setOrdersData(orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    loadData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!marketData) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />
      <div className="lg:ml-64 pt-16 p-4">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <MarketInfo marketData={marketData} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PriceChart marketData={marketData} />
              <OpenOrders ordersData={ordersData} />
            </div>
            <div className="space-y-6">
              <OrderForm orderType={orderType} setOrderType={setOrderType} orderSide={orderSide} setOrderSide={setOrderSide} />
              <OrderBookComponent orderBookData={orderBookData} />
              <RecentTrades tradesData={tradesData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}