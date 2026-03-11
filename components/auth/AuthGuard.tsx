/**
 * Auth guard component that redirects unauthenticated users.
 * Protects routes by redirecting to login when not authenticated,
 * and to main app when authenticated but on auth screens.
 */
import { useRouter, useSegments } from 'expo-router';
import type React from 'react';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

export interface AuthGuardProps {
  /** Child components to render when auth state allows */
  children: React.ReactNode;
}

const AUTH_SEGMENT = '(auth)';
const TABS_SEGMENT = '(tabs)';

/**
 * Wraps app content and handles auth-based redirects.
 * Shows loading while auth state is resolving.
 */
export function AuthGuard({ children }: AuthGuardProps): React.ReactElement {
  const { isLoading, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.some((s) => s === AUTH_SEGMENT);
    const inTabsGroup = segments.some((s) => s === TABS_SEGMENT);

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login' as never);
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as never);
      return;
    }
  }, [isLoading, isAuthenticated, segments, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
