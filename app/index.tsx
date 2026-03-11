/**
 * App entry point that redirects based on auth and onboarding state.
 * - New users → onboarding
 * - Unauthenticated users → login
 * - Authenticated users → home tabs
 */

import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { LoadingScreen } from "@/components/ui";

export default function AppEntry() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);

  if (isLoading) {
    return <LoadingScreen message="Starting up..." />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
