/**
 * Home tab — the main screen users see after logging in.
 * Displays a welcome message with the user's email and quick action cards.
 */

import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authStore";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, Button } from "@/components/ui";

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { isSubscribed } = useSubscription();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="mb-6">
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.onBackground, fontWeight: "700" }}
          >
            Welcome back
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
          >
            {user?.email ?? "User"}
          </Text>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ padding: 20 }}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Your Plan
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {isSubscribed
                ? "You have an active premium subscription."
                : "You are on the free plan. Upgrade to unlock all features."}
            </Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ padding: 20 }}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Getting Started
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}
            >
              This boilerplate includes authentication, subscriptions, push
              notifications, analytics, and more. Customize it to build your
              next great app.
            </Text>
            <Button mode="outlined">Explore Features</Button>
          </View>
        </Card>

        <Card style={{ marginBottom: 32 }}>
          <View style={{ padding: 20 }}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Quick Actions
            </Text>
            <View className="gap-2">
              <Button mode="text" icon="bell-outline">
                Enable Notifications
              </Button>
              <Button mode="text" icon="star-outline">
                Rate the App
              </Button>
              <Button mode="text" icon="share-variant-outline">
                Share with Friends
              </Button>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
