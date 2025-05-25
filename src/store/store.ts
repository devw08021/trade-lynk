// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'              // uses localStorage
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import authReducer from './slices/authSlice'
import marketReducer from './slices/marketSlice'
import walletReducer from './slices/walletSlice'
import themeReducer from './slices/themeSlice'

import { userApi } from '../services/userService'
import { spotApi } from '../services/spotService'
import { perpetualApi } from '../services/perpetualService'
import { p2pApi } from '../services/p2pService'
import { walletApi } from '../services/walletService'

// 1) Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  market: marketReducer,
  wallet: walletReducer,
  theme: themeReducer,
  [userApi.reducerPath]: userApi.reducer,
  [spotApi.reducerPath]: spotApi.reducer,
  [perpetualApi.reducerPath]: perpetualApi.reducer,
  [p2pApi.reducerPath]: p2pApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
})

// 2) Persist config — here we’re persisting only the auth slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

// 3) Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 4) Configure store with serializableCheck tweaks for redux-persist
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      userApi.middleware,
      spotApi.middleware,
      perpetualApi.middleware,
      p2pApi.middleware,
      walletApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

// 5) Create the persistor
export const persistor = persistStore(store)

// 6) Typed hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
