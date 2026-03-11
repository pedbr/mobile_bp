/**
 * Tab navigator layout for the main app screens.
 * Configures bottom tabs for Home and Settings with Material Design icons.
 * Auto-tracks screen views via PostHog analytics.
 */

import { useEffect } from "react";
import { Tabs, usePathname } from "expo-router";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as analytics from "@/lib/analytics";

export default function TabsLayout() {
  const theme = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.screen(pathname);
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
