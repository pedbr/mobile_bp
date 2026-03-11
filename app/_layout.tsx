/**
 * Root layout that wraps the entire app with all required providers:
 * React Native Paper (theming), TanStack Query, Sentry error boundary,
 * and auth state initialization. Also handles font loading and splash screen.
 */

import "@/global.css";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LightTheme, DarkTheme } from "@/constants/colors";
import { queryClient } from "@/lib/queryClient";
import { initSentry, SentryErrorBoundary, wrapWithSentry } from "@/lib/sentry";
import { initOneSignal } from "@/lib/onesignal";
import { initRevenueCat } from "@/lib/revenuecat";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { AuthGuard } from "@/components/auth/AuthGuard";
import * as analytics from "@/lib/analytics";

SplashScreen.preventAutoHideAsync();
initSentry();

function RootLayout() {
  const systemColorScheme = useColorScheme();
  const theme = useAppStore((s) => s.theme);
  const user = useAuthStore((s) => s.user);

  const resolvedTheme =
    theme === "system" ? systemColorScheme ?? "light" : theme;
  const paperTheme = resolvedTheme === "dark" ? DarkTheme : LightTheme;

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    initRevenueCat();
    initOneSignal();
  }, []);

  useEffect(() => {
    if (user?.id) {
      analytics.identify(user.id, { email: user.email });
    }
  }, [user?.id, user?.email]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SentryErrorBoundary fallback={<></>}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={paperTheme}>
            <AuthGuard>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                }}
              />
            </AuthGuard>
            <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
          </PaperProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SentryErrorBoundary>
  );
}

export default wrapWithSentry(RootLayout);
