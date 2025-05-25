import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
  user:  null,
  token: Cookies.get('token') || null, // Retrieve token from cookies if available
  isAuthenticated: !!Cookies.get('token'),
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

      Cookies.set('token', action.payload.token, { expires: 7 }); 
      Cookies.set('user', JSON.stringify(action.payload.user), { expires: 7 });
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
        state.user = { ...state.user, ...action.payload };
        Cookies.set('user', JSON.stringify(action.payload), { expires: 7 });
      }
    },
    setAuthState: (state, action: PayloadAction<{
      token: string | null;
      user: User | null;
      isAuthenticated: boolean;
    }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = false;
      state.error = null;
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
  setAuthState
} = authSlice.actions;

export default authSlice.reducer; 