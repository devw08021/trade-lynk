import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MarketPair, OrderBook } from '@/store/slices/marketSlice';

interface PlaceOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_limit';
  quantity: string;
  price?: string;
  stopPrice?: string;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_limit';
  status: 'new' | 'filled' | 'partially_filled' | 'canceled' | 'rejected' | 'expired';
  quantity: string;
  executedQuantity: string;
  price: string;
  stopPrice?: string;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  createdAt: string;
  updatedAt: string;
}

interface Trade {
  id: string;
  symbol: string;
  price: string;
  quantity: string;
  time: string;
  isBuyerMaker: boolean;
}

interface Ticker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
}

interface KlineData {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export const spotApi = createApi({
  reducerPath: 'spotApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/spot',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['MarketData', 'Orders', 'Trades', 'OrderBook'],
  endpoints: (builder) => ({
    getAllMarketPairs: builder.query<Record<string, MarketPair>, void>({
      query: () => '/markets',
      providesTags: ['MarketData'],
    }),
    
    getOrderBook: builder.query<OrderBook, string>({
      query: (symbol) => `/orderbook?symbol=${symbol}`,
      providesTags: (result, error, symbol) => [{ type: 'OrderBook', id: symbol }],
    }),
    
    getRecentTrades: builder.query<Trade[], { symbol: string, limit?: number }>({
      query: ({ symbol, limit = 50 }) => `/trades?symbol=${symbol}&limit=${limit}`,
      providesTags: (result, error, { symbol }) => [{ type: 'Trades', id: symbol }],
    }),
    
    getTicker: builder.query<Ticker, string>({
      query: (symbol) => `/ticker?symbol=${symbol}`,
    }),
    
    getKlines: builder.query<KlineData[], { symbol: string, interval: string, limit?: number }>({
      query: ({ symbol, interval, limit = 500 }) => 
        `/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    }),
    
    placeOrder: builder.mutation<Order, PlaceOrderRequest>({
      query: (order) => ({
        url: '/order',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: (result, error, { symbol }) => [
        { type: 'Orders', id: 'LIST' },
        { type: 'Orders', id: symbol },
      ],
    }),
    
    cancelOrder: builder.mutation<{ success: boolean }, { symbol: string; orderId: string }>({
      query: ({ symbol, orderId }) => ({
        url: `/order?symbol=${symbol}&orderId=${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { symbol }) => [
        { type: 'Orders', id: 'LIST' },
        { type: 'Orders', id: symbol },
      ],
    }),
    
    getOpenOrders: builder.query<Order[], string | void>({
      query: (symbol) => symbol ? `/open-orders?symbol=${symbol}` : '/open-orders',
      providesTags: (result, error, arg) => 
        result
          ? [
              { type: 'Orders', id: 'LIST' },
              ...result.map(({ symbol }) => ({ type: 'Orders' as const, id: symbol })),
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
    
    getOrderHistory: builder.query<Order[], { symbol?: string; limit?: number; page?: number }>({
      query: ({ symbol, limit = 50, page = 1 }) => {
        let url = `/order-history?limit=${limit}&page=${page}`;
        if (symbol) {
          url += `&symbol=${symbol}`;
        }
        return url;
      },
    }),
    
    getTradeHistory: builder.query<Trade[], { symbol?: string; limit?: number; page?: number }>({
      query: ({ symbol, limit = 50, page = 1 }) => {
        let url = `/my-trades?limit=${limit}&page=${page}`;
        if (symbol) {
          url += `&symbol=${symbol}`;
        }
        return url;
      },
    }),
  }),
});

export const {
  useGetAllMarketPairsQuery,
  useGetOrderBookQuery,
  useGetRecentTradesQuery,
  useGetTickerQuery,
  useGetKlinesQuery,
  usePlaceOrderMutation,
  useCancelOrderMutation,
  useGetOpenOrdersQuery,
  useGetOrderHistoryQuery,
  useGetTradeHistoryQuery,
} = spotApi; 