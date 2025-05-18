import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface P2POffer {
  id: string;
  creator: {
    id: string;
    username: string;
    completedTrades: number;
    positiveRating: number;
    accountCreationDate: string;
  };
  type: 'buy' | 'sell';
  asset: string;
  fiatCurrency: string;
  price: string;
  minAmount: string;
  maxAmount: string;
  availableAmount: string;
  paymentMethods: string[];
  terms: string;
  autoReply?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface P2PTrade {
  id: string;
  offer: P2POffer;
  buyer: {
    id: string;
    username: string;
  };
  seller: {
    id: string;
    username: string;
  };
  amount: string;
  fiatAmount: string;
  price: string;
  status: 'pending_payment' | 'payment_sent' | 'payment_confirmed' | 'completed' | 'cancelled' | 'disputed';
  paymentMethod: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

interface P2PTradeMessage {
  id: string;
  tradeId: string;
  senderId: string;
  senderUsername: string;
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

interface CreateOfferRequest {
  type: 'buy' | 'sell';
  asset: string;
  fiatCurrency: string;
  price: string;
  minAmount: string;
  maxAmount: string;
  availableAmount: string;
  paymentMethods: string[];
  terms: string;
  autoReply?: string;
}

interface CreateTradeRequest {
  offerId: string;
  amount: string;
  paymentMethod: string;
}

interface SendMessageRequest {
  tradeId: string;
  message: string;
  attachment?: File;
}

interface FeedbackRequest {
  tradeId: string;
  rating: 'positive' | 'negative';
  comment?: string;
}

export const p2pApi = createApi({
  reducerPath: 'p2pApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/p2p',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Offers', 'MyOffers', 'Trades', 'Messages', 'Feedback'],
  endpoints: (builder) => ({
    searchOffers: builder.query<
      P2POffer[], 
      { 
        type: 'buy' | 'sell',
        asset?: string,
        fiatCurrency?: string,
        paymentMethod?: string,
        page?: number,
        limit?: number
      }
    >({
      query: ({ type, asset, fiatCurrency, paymentMethod, page = 1, limit = 20 }) => {
        let url = `/offers?type=${type}&page=${page}&limit=${limit}`;
        if (asset) url += `&asset=${asset}`;
        if (fiatCurrency) url += `&fiatCurrency=${fiatCurrency}`;
        if (paymentMethod) url += `&paymentMethod=${paymentMethod}`;
        return url;
      },
      providesTags: ['Offers'],
    }),
    
    getOfferById: builder.query<P2POffer, string>({
      query: (id) => `/offer/${id}`,
      providesTags: (result, error, id) => [{ type: 'Offers', id }],
    }),
    
    getMyOffers: builder.query<P2POffer[], void>({
      query: () => '/my-offers',
      providesTags: ['MyOffers'],
    }),
    
    createOffer: builder.mutation<P2POffer, CreateOfferRequest>({
      query: (offer) => ({
        url: '/offer',
        method: 'POST',
        body: offer,
      }),
      invalidatesTags: ['MyOffers', 'Offers'],
    }),
    
    updateOffer: builder.mutation<P2POffer, { id: string; update: Partial<CreateOfferRequest> }>({
      query: ({ id, update }) => ({
        url: `/offer/${id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        'MyOffers',
        'Offers',
        { type: 'Offers', id },
      ],
    }),
    
    deleteOffer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/offer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyOffers', 'Offers'],
    }),
    
    getMyTrades: builder.query<P2PTrade[], { status?: P2PTrade['status'], page?: number, limit?: number }>({
      query: ({ status, page = 1, limit = 20 }) => {
        let url = `/trades?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Trades'],
    }),
    
    getTrade: builder.query<P2PTrade, string>({
      query: (id) => `/trade/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trades', id }],
    }),
    
    createTrade: builder.mutation<P2PTrade, CreateTradeRequest>({
      query: (trade) => ({
        url: '/trade',
        method: 'POST',
        body: trade,
      }),
      invalidatesTags: ['Trades', 'Offers'],
    }),
    
    updateTradeStatus: builder.mutation<P2PTrade, { id: string; status: P2PTrade['status'] }>({
      query: ({ id, status }) => ({
        url: `/trade/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ['Trades', { type: 'Trades', id }],
    }),
    
    getTradeMessages: builder.query<P2PTradeMessage[], { tradeId: string; page?: number; limit?: number }>({
      query: ({ tradeId, page = 1, limit = 50 }) => `/trade/${tradeId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, { tradeId }) => [{ type: 'Messages', id: tradeId }],
    }),
    
    sendMessage: builder.mutation<P2PTradeMessage, SendMessageRequest>({
      query: ({ tradeId, message, attachment }) => {
        const formData = new FormData();
        formData.append('message', message);
        if (attachment) {
          formData.append('attachment', attachment);
        }
        
        return {
          url: `/trade/${tradeId}/message`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { tradeId }) => [{ type: 'Messages', id: tradeId }],
    }),
    
    leaveFeedback: builder.mutation<{ success: boolean }, FeedbackRequest>({
      query: (feedback) => ({
        url: '/feedback',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback'],
    }),
    
    getPaymentMethods: builder.query<string[], void>({
      query: () => '/payment-methods',
    }),
  }),
});

export const {
  useSearchOffersQuery,
  useGetOfferByIdQuery,
  useGetMyOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetMyTradesQuery,
  useGetTradeQuery,
  useCreateTradeMutation,
  useUpdateTradeStatusMutation,
  useGetTradeMessagesQuery,
  useSendMessageMutation,
  useLeaveFeedbackMutation,
  useGetPaymentMethodsQuery,
} = p2pApi; 