import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  available: string;
  locked: string;
  usdValue: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  asset: string;
  amount: string;
  fee: string;
  timestamp: string;
  txHash?: string;
  destination?: string;
  source?: string;
}

export interface WalletState {
  assets: Record<string, Asset>;
  selectedAsset: string | null;
  transactions: Transaction[];
  depositAddress: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  walletConnected: boolean;
  walletsProviders: string[];
  selectedProvider: string | null;
}

const initialState: WalletState = {
  assets: {},
  selectedAsset: null,
  transactions: [],
  depositAddress: {},
  isLoading: false,
  error: null,
  walletConnected: false,
  walletsProviders: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'],
  selectedProvider: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchBalancesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBalancesSuccess: (state, action: PayloadAction<Record<string, Asset>>) => {
      state.isLoading = false;
      state.assets = action.payload;
      
      if (!state.selectedAsset && Object.keys(action.payload).length > 0) {
        state.selectedAsset = Object.keys(action.payload)[0];
      }
    },
    fetchBalancesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.isLoading = false;
      state.transactions = action.payload;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectAsset: (state, action: PayloadAction<string>) => {
      state.selectedAsset = action.payload;
    },
    updateAsset: (state, action: PayloadAction<Asset>) => {
      const { symbol } = action.payload;
      state.assets[symbol] = action.payload;
    },
    generateDepositAddress: (state, action: PayloadAction<{ asset: string; address: string }>) => {
      const { asset, address } = action.payload;
      state.depositAddress[asset] = address;
    },
    connectWallet: (state, action: PayloadAction<string>) => {
      state.walletConnected = true;
      state.selectedProvider = action.payload;
    },
    disconnectWallet: (state) => {
      state.walletConnected = false;
      state.selectedProvider = null;
    },
  },
});

export const {
  fetchBalancesStart,
  fetchBalancesSuccess,
  fetchBalancesFailure,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  selectAsset,
  updateAsset,
  generateDepositAddress,
  connectWallet,
  disconnectWallet,
} = walletSlice.actions;

export default walletSlice.reducer; 