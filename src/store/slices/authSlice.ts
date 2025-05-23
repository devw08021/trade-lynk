import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  role: string;
  avatar?: string;
  profilePicture?: string;
  kycVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined'
    ? localStorage.getItem('token') !== null
    : false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
      // if (typeof window !== 'undefined') {
      //   localStorage.setItem('user', JSON.stringify(action.payload.user));
      // }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    register: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (action.payload) {
        state.user = { ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  register,
  registerSuccess,
  registerFailure,
  logout,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer; 