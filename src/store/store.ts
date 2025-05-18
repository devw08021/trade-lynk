import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import walletReducer from './slices/walletSlice';
import themeReducer from './slices/themeSlice';

import { userApi } from '../services/userService';
import { spotApi } from '../services/spotService';
import { perpetualApi } from '../services/perpetualService';
import { p2pApi } from '../services/p2pService';
import { walletApi } from '../services/walletService';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    wallet: walletReducer,
    theme: themeReducer,
    [userApi.reducerPath]: userApi.reducer,
    [spotApi.reducerPath]: spotApi.reducer,
    [perpetualApi.reducerPath]: perpetualApi.reducer,
    [p2pApi.reducerPath]: p2pApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      spotApi.middleware,
      perpetualApi.middleware,
      p2pApi.middleware,
      walletApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 