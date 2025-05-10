'use client';

interface Order {
  id: string;
  pair: string;
  type: string;
  side: string;
  price: number;
  amount: number;
  filled: string;
  date: string;
}

interface OpenOrdersProps {
  ordersData: Order[];
}

export default function OpenOrders({ ordersData }: OpenOrdersProps) {
  return (
    <div className="glassmorphism rounded-lg p-4 glow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Open Orders</h3>
        <button className="text-xs text-blue-400 hover:text-blue-300">View All</button>
      </div>
      {ordersData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Filled
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {ordersData.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.pair}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.side === 'Buy' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {order.side}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                    ${order.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">{order.filled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-400 hover:text-red-300">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No open orders</p>
        </div>
      )}
    </div>
  );
}