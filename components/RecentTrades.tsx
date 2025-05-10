'use client';

interface Trade {
  id: number;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

interface RecentTradesProps {
  tradesData: Trade[];
}

export default function RecentTrades({ tradesData }: RecentTradesProps) {
  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Recent Trades</h3>
      </div>
      <div className="grid grid-cols-3 text-xs text-gray-400 mb-1 px-2">
        <div>Price (USDT)</div>
        <div className="text-right">Amount (BTC)</div>
        <div className="text-right">Time</div>
      </div>
      <div className="space-y-1">
        {tradesData.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 text-xs py-1 px-2 hover:bg-gray-800/50">
            <div className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
              {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-right text-gray-300">
              {trade.amount.toLocaleString('en-US', { minimumFractionDigits: 6 })}
            </div>
            <div className="text-right text-gray-400">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}