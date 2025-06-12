import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset, Transaction } from '@/store/slices/walletSlice';

interface DepositAddressResponse {
  address: string;
  memo?: string;
  network: string;
}

interface WithdrawRequest {
  asset: string;
  address: string;
  amount: string;
  memo?: string;
  network?: string;
}

interface WithdrawResponse {
  id: string;
  asset: string;
  amount: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  txHash?: string;
  createdAt: string;
}

interface TransferRequest {
  asset: string;
  amount: string;
  fromAccount: 'spot' | 'funding' | 'p2p' | 'futures';
  toAccount: 'spot' | 'funding' | 'p2p' | 'futures';
}

interface SwapRequest {
  fromAsset: string;
  toAsset: string;
  amount: string;
}

interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  fee: string;
  expiresAt: number;
}

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_WALLET_API_URL}/api/v1/wallets`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Balances', 'Deposits', 'Withdrawals', 'Transactions'],
  endpoints: (builder) => ({
    // Balances
    getAllBalances: builder.query<Record<string, Asset>, void>({
      query: () => '/getWallets',
      providesTags: ['Balances'],
    }),
    
    getAssetBalance: builder.query<Asset, string>({
      query: (asset) => `/balance?asset=${asset}`,
      providesTags: (result, error, asset) => [{ type: 'Balances', id: asset }],
    }),
    
    // Deposits
    getDepositAddress: builder.query<DepositAddressResponse, { asset: string; network?: string }>({
      query: ({ asset, network }) => {
        let url = `/deposit-address?asset=${asset}`;
        if (network) {
          url += `&network=${network}`;
        }
        return url;
      },
    }),
    
    getNetworks: builder.query<{ asset: string; networks: string[] }[], string>({
      query: (asset) => `/networks?asset=${asset}`,
    }),
    
    getDepositHistory: builder.query<Transaction[], { asset?: string; status?: string; limit?: number; page?: number }>({
      query: ({ asset, status, limit = 50, page = 1 }) => {
        let url = `/deposit-history?limit=${limit}&page=${page}`;
        if (asset) url += `&asset=${asset}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Deposits', 'Transactions'],
    }),
    
    // Withdrawals
    withdraw: builder.mutation<WithdrawResponse, WithdrawRequest>({
      query: (body) => ({
        url: '/withdraw',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balances', 'Withdrawals', 'Transactions'],
    }),
    
    getWithdrawalHistory: builder.query<Transaction[], { asset?: string; status?: string; limit?: number; page?: number }>({
      query: ({ asset, status, limit = 50, page = 1 }) => {
        let url = `/withdrawal-history?limit=${limit}&page=${page}`;
        if (asset) url += `&asset=${asset}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Withdrawals', 'Transactions'],
    }),
    
    // Transfers
    transfer: builder.mutation<{ success: boolean; id: string }, TransferRequest>({
      query: (body) => ({
        url: '/transfer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balances', 'Transactions'],
    }),
    
    getTransferHistory: builder.query<Transaction[], { limit?: number; page?: number }>({
      query: ({ limit = 50, page = 1 }) => `/transfer-history?limit=${limit}&page=${page}`,
      providesTags: ['Transactions'],
    }),
    
    // Swaps
    getSwapQuote: builder.query<SwapQuote, { fromAsset: string; toAsset: string; amount: string }>({
      query: ({ fromAsset, toAsset, amount }) => 
        `/swap/quote?fromAsset=${fromAsset}&toAsset=${toAsset}&amount=${amount}`,
    }),
    
    executeSwap: builder.mutation<{ success: boolean; id: string }, SwapRequest>({
      query: (body) => ({
        url: '/swap',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balances', 'Transactions'],
    }),
    
    // Transaction History
    getTransactionHistory: builder.query<
      Transaction[],
      { type?: string; asset?: string; limit?: number; page?: number; startTime?: number; endTime?: number }
    >({
      query: ({ type, asset, limit = 50, page = 1, startTime, endTime }) => {
        let url = `/transactions?limit=${limit}&page=${page}`;
        if (type) url += `&type=${type}`;
        if (asset) url += `&asset=${asset}`;
        if (startTime) url += `&startTime=${startTime}`;
        if (endTime) url += `&endTime=${endTime}`;
        return url;
      },
      providesTags: ['Transactions'],
    }),
    
    // Wallet Connect
    getAvailableWallets: builder.query<string[], void>({
      query: () => '/available-wallets',
    }),
  }),
});

export const {
  useGetAllBalancesQuery,
  useGetAssetBalanceQuery,
  useGetDepositAddressQuery,
  useGetNetworksQuery,
  useGetDepositHistoryQuery,
  useWithdrawMutation,
  useGetWithdrawalHistoryQuery,
  useTransferMutation,
  useGetTransferHistoryQuery,
  useGetSwapQuoteQuery,
  useExecuteSwapMutation,
  useGetTransactionHistoryQuery,
  useGetAvailableWalletsQuery,
} = walletApi; 