/**
 * Settings screen with user info, subscription management, theme toggle,
 * account actions (restore purchases, delete account, logout).
 * All required by App Store and Google Play guidelines.
 */

import { useState } from "react";
import { View, ScrollView, Alert, Linking, Platform } from "react-native";
import {
  Text,
  Switch,
  Divider,
  Avatar,
  List,
  Dialog,
  Portal,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useAppStore, type Theme } from "@/stores/appStore";
import { Button } from "@/components/ui";
import {
  SUPPORT_EMAIL,
  PRIVACY_POLICY_URL,
  TERMS_URL,
} from "@/constants/config";

const SUBSCRIPTION_MANAGEMENT_URL = Platform.select({
  ios: "https://apps.apple.com/account/subscriptions",
  android:
    "https://play.google.com/store/account/subscriptions",
  default: "",
});

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, signOut, deleteAccount, isLoading } = useAuth();
  const { isSubscribed, restore } = useSubscription();
  const appTheme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDarkMode = appTheme === "dark";

  const handleThemeToggle = () => {
    const next: Theme = isDarkMode ? "light" : "dark";
    setTheme(next);
  };

  const handleRestorePurchases = async () => {
    try {
      await restore();
      Alert.alert("Purchases Restored", "Your purchases have been restored.");
    } catch {
      Alert.alert("Error", "Failed to restore purchases. Please try again.");
    }
  };

  const handleManageSubscription = () => {
    if (SUBSCRIPTION_MANAGEMENT_URL) {
      Linking.openURL(SUBSCRIPTION_MANAGEMENT_URL);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setDeleteDialogVisible(false);
    } catch {
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const avatarLabel = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView className="flex-1">
        <View className="px-4 pt-6 pb-4">
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.onBackground, fontWeight: "700" }}
          >
            Settings
          </Text>
        </View>

        {/* User Info */}
        <View className="px-4 py-4 flex-row items-center gap-4">
          <Avatar.Text
            size={56}
            label={avatarLabel}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View className="flex-1">
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onBackground, fontWeight: "600" }}
            >
              {user?.email ?? "User"}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {isSubscribed ? "Premium Member" : "Free Plan"}
            </Text>
          </View>
        </View>

        <Divider />

        {/* Subscription */}
        <List.Section>
          <List.Subheader>Subscription</List.Subheader>
          <List.Item
            title="Manage Subscription"
            description={isSubscribed ? "Active premium plan" : "Upgrade to premium"}
            left={(props) => <List.Icon {...props} icon="crown" />}
            onPress={
              isSubscribed
                ? handleManageSubscription
                : () => router.push("/paywall" as never)
            }
          />
          <List.Item
            title="Restore Purchases"
            description="Restore previous purchases"
            left={(props) => <List.Icon {...props} icon="restore" />}
            onPress={handleRestorePurchases}
          />
        </List.Section>

        <Divider />

        {/* Appearance */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description={isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
            left={(props) => (
              <List.Icon
                {...props}
                icon={isDarkMode ? "weather-night" : "weather-sunny"}
              />
            )}
            right={() => (
              <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
            )}
          />
        </List.Section>

        <Divider />

        {/* Support */}
        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Contact Support"
            left={(props) => <List.Icon {...props} icon="email-outline" />}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-check-outline" />}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            onPress={() => Linking.openURL(TERMS_URL)}
          />
        </List.Section>

        <Divider />

        {/* Account Actions */}
        <View className="px-4 py-6 gap-3">
          <Button mode="outlined" onPress={handleSignOut} loading={isLoading} fullWidth>
            Sign Out
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={() => setDeleteDialogVisible(true)}
            fullWidth
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>

      {/* Delete Account Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This action is permanent and cannot be undone. All your data will
              be deleted. Are you sure you want to continue?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => setDeleteDialogVisible(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              mode="text"
              textColor={theme.colors.error}
              onPress={handleDeleteAccount}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}
