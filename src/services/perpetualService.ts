import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PerpetualPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  markPrice: string;
  indexPrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  openInterestLong: string;
  openInterestShort: string;
  volume24h: string;
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  maxLeverage: number;
}

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  markPrice: string;
  liquidationPrice: string;
  margin: string;
  leverage: number;
  unrealizedPnl: string;
  unrealizedPnlPercent: string;
  marginRatio: string;
  createdAt: string;
  updatedAt: string;
}

interface PlacePerpetualOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  positionSide?: 'long' | 'short' | 'both';
  quantity: string;
  price?: string;
  stopPrice?: string;
  reduceOnly?: boolean;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  leverage?: number;
}

interface PerpetualOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  positionSide: 'long' | 'short' | 'both';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  status: 'new' | 'filled' | 'partially_filled' | 'canceled' | 'rejected' | 'expired';
  quantity: string;
  executedQuantity: string;
  price: string;
  stopPrice?: string;
  reduceOnly: boolean;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  createdAt: string;
  updatedAt: string;
}

interface FundingHistory {
  id: string;
  symbol: string;
  fundingRate: string;
  fundingFee: string;
  timestamp: number;
}

interface PerpetualTrade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: string;
  quantity: string;
  realizedPnl: string;
  fee: string;
  timestamp: number;
}

export const perpetualApi = createApi({
  reducerPath: 'perpetualApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/perpetual',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['PerpetualPairs', 'Positions', 'Orders', 'Trades', 'Funding'],
  endpoints: (builder) => ({
    getPerpetualPairs: builder.query<Record<string, PerpetualPair>, void>({
      query: () => '/markets',
      providesTags: ['PerpetualPairs'],
    }),
    
    getPerpetualMarkPrice: builder.query<{ markPrice: string, indexPrice: string, fundingRate: string }, string>({
      query: (symbol) => `/price?symbol=${symbol}`,
    }),
    
    getOpenPositions: builder.query<Position[], void>({
      query: () => '/positions',
      providesTags: ['Positions'],
    }),
    
    getPosition: builder.query<Position, string>({
      query: (symbol) => `/position?symbol=${symbol}`,
      providesTags: (result, error, symbol) => [{ type: 'Positions', id: symbol }],
    }),
    
    getFundingHistory: builder.query<FundingHistory[], { symbol: string, limit?: number }>({
      query: ({ symbol, limit = 50 }) => `/funding-history?symbol=${symbol}&limit=${limit}`,
      providesTags: ['Funding'],
    }),
    
    adjustLeverage: builder.mutation<{ success: boolean }, { symbol: string, leverage: number }>({
      query: ({ symbol, leverage }) => ({
        url: '/leverage',
        method: 'POST',
        body: { symbol, leverage },
      }),
      invalidatesTags: (result, error, { symbol }) => [{ type: 'Positions', id: symbol }],
    }),
    
    placePerpetualOrder: builder.mutation<PerpetualOrder, PlacePerpetualOrderRequest>({
      query: (order) => ({
        url: '/order',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    
    cancelPerpetualOrder: builder.mutation<{ success: boolean }, { symbol: string, orderId: string }>({
      query: ({ symbol, orderId }) => ({
        url: `/order?symbol=${symbol}&orderId=${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
    
    closePosition: builder.mutation<{ success: boolean }, { symbol: string, positionSide?: 'long' | 'short' }>({
      query: ({ symbol, positionSide }) => ({
        url: '/close-position',
        method: 'POST',
        body: { symbol, positionSide },
      }),
      invalidatesTags: (result, error, { symbol }) => [
        { type: 'Positions', id: symbol },
        'Orders',
      ],
    }),
    
    getOpenPerpetualOrders: builder.query<PerpetualOrder[], string | void>({
      query: (symbol) => symbol ? `/open-orders?symbol=${symbol}` : '/open-orders',
      providesTags: ['Orders'],
    }),
    
    getPerpetualOrderHistory: builder.query<
      PerpetualOrder[], 
      { symbol?: string; limit?: number; page?: number }
    >({
      query: ({ symbol, limit = 50, page = 1 }) => {
        let url = `/order-history?limit=${limit}&page=${page}`;
        if (symbol) {
          url += `&symbol=${symbol}`;
        }
        return url;
      },
    }),
    
    getPerpetualTradeHistory: builder.query<
      PerpetualTrade[], 
      { symbol?: string; limit?: number; page?: number }
    >({
      query: ({ symbol, limit = 50, page = 1 }) => {
        let url = `/my-trades?limit=${limit}&page=${page}`;
        if (symbol) {
          url += `&symbol=${symbol}`;
        }
        return url;
      },
      providesTags: ['Trades'],
    }),
  }),
});

export const {
  useGetPerpetualPairsQuery,
  useGetPerpetualMarkPriceQuery,
  useGetOpenPositionsQuery,
  useGetPositionQuery,
  useGetFundingHistoryQuery,
  useAdjustLeverageMutation,
  usePlacePerpetualOrderMutation,
  useCancelPerpetualOrderMutation,
  useClosePositionMutation,
  useGetOpenPerpetualOrdersQuery,
  useGetPerpetualOrderHistoryQuery,
  useGetPerpetualTradeHistoryQuery,
} = perpetualApi; 