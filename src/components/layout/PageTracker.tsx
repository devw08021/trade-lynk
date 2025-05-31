'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useGetCurrentUserQuery, useGetCurrentUserSettingQuery } from '@/services/userService';
import { updateUserProfile, setUserSetting } from '@/store/slices/authSlice';
import { setTheme } from '@/store/slices/themeSlice';
export default function PageTracker() {

    const { resolvedTheme, setTheme: setNextTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { mode } = useAppSelector((state) => state.theme);

    const { isLoading, refetch: getCurrentUser } = useGetCurrentUserQuery();
    const { isLoading: isSettingLoading, refetch: getCurrentUserSetting } = useGetCurrentUserSettingQuery();

    const getUserDetails = async (path: string) => {
        try {
            const { result } = await getCurrentUser().unwrap();
            dispatch(updateUserProfile(result));

        } catch (error: any) {
            console.error("🚀 ~ getUserDetails ~ error:", error)

        }
    };
    const getUserSettings = async (path: string) => {
        try {
            const { result } = await getCurrentUserSetting().unwrap()
            dispatch(setUserSetting(result));
            if (result?.theme != mode) {
                setNextTheme(result?.theme)
                dispatch(setTheme(result?.theme))
            }
            console.log("🚀 ~ getUserSettings ~ result?.theme:", result?.theme, mode)

        } catch (error: any) {
            console.error("🚀 ~ getUserDetails ~ error:", error)

        }
    }
    useEffect(() => {
        // Call your API on each page navigation
        if (isAuthenticated) {
            getUserDetails(pathname);
            getUserSettings(pathname);
        }

    }, [pathname]);

    return null; // This component doesn't render anything
}
