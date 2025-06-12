'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppSelector, useAppDispatch } from '@/store/store';

//user
import { useGetCurrentUserQuery, useGetCurrentUserSettingQuery } from '@/services/userService';
import { updateUserProfile, setUserSetting } from '@/store/slices/authSlice';


//wallet
import { useGetAllBalancesQuery } from '@/services/walletService';
import { fetchBalancesSuccess } from '@/store/slices/walletSlice';
import { setTheme } from '@/store/slices/themeSlice';
export default function PageTracker() {

    const { resolvedTheme, setTheme: setNextTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { mode } = useAppSelector((state) => state.theme);


    //user
    const { isLoading, refetch: getCurrentUser } = useGetCurrentUserQuery();
    const { isLoading: isSettingLoading, refetch: getCurrentUserSetting } = useGetCurrentUserSettingQuery();

    const getUserDetails = async (path: string) => {
        try {
            const { data } = await getCurrentUser().unwrap();
            dispatch(updateUserProfile(data));

        } catch (err: any) {
            console.error("🚀 ~ getUserDetails ~ error:", err)

        }
    };
    const getUserSettings = async (path: string) => {
        try {
            const { data } = await getCurrentUserSetting().unwrap()
            dispatch(setUserSetting(data));
            if (data?.theme != mode) {
                setNextTheme(data?.theme)
                dispatch(setTheme(data?.theme))
            }
            console.log("🚀 ~ getUserSettings ~ result?.theme:", data?.theme, mode)

        } catch (err: any) {
            console.error("🚀 ~ getUserDetails ~ error:", err)

        }
    }

    //wallet
    const { isLoading:walletLoading, refetch: getAllBalances } = useGetAllBalancesQuery();

    const getUserWallet = async (path: string) => {
        try {
            const { data } = await getAllBalances().unwrap();
            if(data?.assets)
            dispatch(fetchBalancesSuccess(data?.assets));

        } catch (err: any) {
            console.error("🚀 ~ getUserDetails ~ error:", err)

        }
    };

    useEffect(() => {
        // Call your API on each page navigation
        if (isAuthenticated) {
            getUserDetails(pathname);
            getUserSettings(pathname);
            getUserWallet(pathname)
        }

    }, [pathname]);

    return null; // This component doesn't render anything
}
