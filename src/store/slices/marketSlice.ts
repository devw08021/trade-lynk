import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MarketPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

export interface OrderBook {
  bids: [string, string][]; 
  asks: [string, string][]; 
}

export interface MarketState {
  pairs: Record<string, MarketPair>;
  selectedPair: string | null;
  orderBook: OrderBook | null;
  recentTrades: any[];
  chartData: any[];
  isLoading: boolean;
  error: string | null;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
}

const initialState: MarketState = {
  pairs: {},
  selectedPair: null,
  orderBook: null,
  recentTrades: [],
  chartData: [],
  isLoading: false,
  error: null,
  timeframe: '15m',
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    fetchMarketPairsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMarketPairsSuccess: (state, action: PayloadAction<Record<string, MarketPair>>) => {
      state.isLoading = false;
      state.pairs = action.payload;
      
      if (!state.selectedPair && Object.keys(action.payload).length > 0) {
        state.selectedPair = Object.keys(action.payload)[0];
      }
    },
    fetchMarketPairsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectMarketPair: (state, action: PayloadAction<string>) => {
      state.selectedPair = action.payload;
    },
    updateOrderBook: (state, action: PayloadAction<OrderBook>) => {
      state.orderBook = action.payload;
    },
    updateRecentTrades: (state, action: PayloadAction<any[]>) => {
      state.recentTrades = action.payload;
    },
    updateChartData: (state, action: PayloadAction<any[]>) => {
      state.chartData = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<MarketState['timeframe']>) => {
      state.timeframe = action.payload;
    },
    updateMarketPrice: (state, action: PayloadAction<{ symbol: string; price: string; change: string }>) => {
      const { symbol, price, change } = action.payload;
      if (state.pairs[symbol]) {
        state.pairs[symbol] = {
          ...state.pairs[symbol],
          lastPrice: price,
          priceChangePercent: change,
        };
      }
    },
  },
});

export const {
  fetchMarketPairsStart,
  fetchMarketPairsSuccess,
  fetchMarketPairsFailure,
  selectMarketPair,
  updateOrderBook,
  updateRecentTrades,
  updateChartData,
  setTimeframe,
  updateMarketPrice,
} = marketSlice.actions;

export default marketSlice.reducer; 