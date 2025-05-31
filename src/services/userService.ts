import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/store/slices/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  result: object;
  success: boolean;
}

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
}

interface EnableTwoFactorResponse {
  secret: string;
  qrCodeUrl: string;
}

interface VerifyTwoFactorRequest {
  code: string;
}

interface KycRequest {
  documentType: string;
  documentNumber: string;
  country: string;
  documentFront: File;
  documentBack: File;
  selfie: File;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User', 'TwoFactor', 'KYC'],
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginRequest>({
      query: (credentials) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/auth/login`,
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<any, RegisterRequest>({
      query: (userData) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/auth/register`,
        method: 'POST',
        body: userData,
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/profile`,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (profile) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/profile`,
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['User'],
    }),

    //password update
    updatePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/updatePassword`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['User'],
    }),


    // Two-Factor Authentication
    enableTwoFactor: builder.mutation<any, VerifyTwoFactorRequest>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/2fa/enable`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['TwoFactor'],
    }),

    getTwoFactor: builder.mutation<{ success: boolean }, VerifyTwoFactorRequest>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/2fa/code`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TwoFactor', 'User'],
    }),

    disableTwoFactor: builder.mutation<{ success: boolean }, VerifyTwoFactorRequest>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/2fa/disable`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['TwoFactor', 'User'],
    }),

    submitKyc: builder.mutation<{ success: boolean, status: string }, KycRequest>({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return {
          url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/kyc/submit`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['KYC', 'User'],
    }),

    getKycStatus: builder.query<{ status: string, message?: string }, void>({
      query: () => `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/kyc/status`,
      providesTags: ['KYC'],
    }),

    getNonce: builder.query<{ nonce: string }, string>({
      query: (address) => `/wallet/nonce?address=${address}`,
    }),

    verifyWalletSignature: builder.mutation<any, { address: string; signature: string }>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/wallet/verify`,
        method: 'POST',
        body: data,
      }),
    }),



    //userSetting
    getCurrentUserSetting: builder.query<any, void>({
      query: () => `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/userSetting`,
      providesTags: ['User'],
    }),
    updateUserSetting: builder.mutation<{ success: boolean }, any>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_USER_API_URL}/api/user/userSetting`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useSubmitKycMutation,
  useGetKycStatusQuery,
  useGetNonceQuery,
  useVerifyWalletSignatureMutation,
  useGetCurrentUserSettingQuery,
  useUpdateUserSettingMutation,
} = userApi; 