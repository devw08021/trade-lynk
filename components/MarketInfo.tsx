'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
}

interface MarketInfoProps {
  marketData: MarketData;
}

export default function MarketInfo({ marketData }: MarketInfoProps) {
  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full h-8 w-8 flex items-center justify-center mr-3">
            <span className="font-bold text-black">₿</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{marketData.symbol}/USDT</h2>
            <p className="text-sm text-gray-400">{marketData.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            className={`text-sm font-medium ${
              marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            } flex items-center justify-end`}
          >
            {marketData.change24h >= 0 ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            {marketData.change24h >= 0 ? '+' : ''}
            {marketData.change24h}%
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div>
          <p className="text-xs text-gray-500">24h High</p>
          <p className="text-sm text-white">
            ${marketData.high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">24h Low</p>
          <p className="text-sm text-white">
            ${marketData.low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">24h Volume</p>
          <p className="text-sm text-white">${marketData.volume24h}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Market Cap</p>
          <p className="text-sm text-white">${marketData.marketCap}</p>
        </div>
      </div>
    </div>
  );
}
