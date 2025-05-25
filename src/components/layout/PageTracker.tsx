'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useGetCurrentUserQuery } from '@/services/userService';
import { updateUserProfile } from '@/store/slices/authSlice';

export default function PageTracker() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const { isLoading, refetch: getCurrentUser } = useGetCurrentUserQuery();

    const getUserDetails = async (path: string) => {
        try {
            const { result } = await getCurrentUser().unwrap();
            dispatch(updateUserProfile(result));

        } catch (error) {
            console.error("🚀 ~ getUserDetails ~ error:", error)

        }
    };
    useEffect(() => {
        // Call your API on each page navigation
        if (isAuthenticated) 
            getUserDetails(pathname);
    }, [pathname]);

    return null; // This component doesn't render anything
}
