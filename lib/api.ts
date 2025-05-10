export interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
}

export interface Order {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  asks: Order[];
  bids: Order[];
}

export interface Trade {
  id: number;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

export interface OpenOrder {
  id: string;
  pair: string;
  type: string;
  side: string;
  price: number;
  amount: number;
  filled: string;
  date: string;
}

export async function fetchMarketData(): Promise<MarketData> {
  return {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 62843.17,
    change24h: 2.34,
    high24h: 63512.89,
    low24h: 61245.76,
    volume24h: '24.5B',
    marketCap: '1.2T',
  };
}

export async function fetchOrderBook(): Promise<OrderBook> {
  return {
    asks: [
      { price: 62910.25, amount: 1.25, total: 78637.81 },
      { price: 62895.5, amount: 0.86, total: 54089.13 },
      { price: 62880.75, amount: 2.34, total: 147140.96 },
    ],
    bids: [
      { price: 62845.3, amount: 0.56, total: 35193.37 },
      { price: 62830.45, amount: 1.72, total: 108068.37 },
      { price: 62815.6, amount: 3.18, total: 199753.61 },
    ],
  };
}

export async function fetchRecentTrades(): Promise<Trade[]> {
  return [
    { id: 1, price: 62843.17, amount: 0.0456, time: '12:45:23', type: 'buy' },
    { id: 2, price: 62841.3, amount: 0.1205, time: '12:44:57', type: 'sell' },
    { id: 3, price: 62845.79, amount: 0.0322, time: '12:44:32', type: 'buy' },
    { id: 4, price: 62838.25, amount: 0.0511, time: '12:44:02', type: 'sell' },
    { id: 5, price: 62846.93, amount: 0.0267, time: '12:43:45', type: 'buy' },
  ];
}

export async function fetchOpenOrders(): Promise<OpenOrder[]> {
  return [
    {
      id: '34254',
      pair: 'BTC/USDT',
      type: 'Limit',
      side: 'Buy',
      price: 62500.0,
      amount: 0.245,
      filled: '0%',
      date: '2025-05-10 12:30',
    },
  ];
}