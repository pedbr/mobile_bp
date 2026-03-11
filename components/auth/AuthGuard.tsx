/**
 * Auth guard component that redirects unauthenticated users.
 * Protects routes by redirecting to (tabs) when authenticated on auth screens,
 * and to login when unauthenticated on protected screens.
 * Public routes (onboarding, root index) are always accessible.
 */
import { useRouter, useSegments } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

export interface AuthGuardProps {
  children: React.ReactNode;
}

const AUTH_SEGMENT = "(auth)";
const TABS_SEGMENT = "(tabs)";
const ONBOARDING_SEGMENT = "onboarding";

/**
 * Wraps app content and handles auth-based redirects.
 * Shows LoadingScreen while auth state is resolving.
 * Allows public routes (onboarding, root index) without authentication.
 */
export function AuthGuard({ children }: AuthGuardProps): React.ReactElement {
  const { isLoading, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.some((s) => s === AUTH_SEGMENT);
    const inTabsGroup = segments.some((s) => s === TABS_SEGMENT);
    const inOnboarding = segments.some((s) => s === ONBOARDING_SEGMENT);

    if (inOnboarding || (segments as string[]).length === 0) {
      return;
    }

    if (!isAuthenticated && inTabsGroup) {
      router.replace("/(auth)/login" as never);
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)" as never);
      return;
    }
  }, [isLoading, isAuthenticated, segments, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
