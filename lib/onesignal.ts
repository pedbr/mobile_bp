/**
 * OneSignal push notification setup and helper functions.
 * Handles SDK initialization, permission management, and player ID retrieval.
 *
 * Gracefully degrades in Expo Go where the native module is unavailable —
 * all functions become no-ops that return safe defaults.
 */

import Constants, { ExecutionEnvironment } from "expo-constants";

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === "expo";

interface OneSignalModule {
  OneSignal: {
    Debug: { setLogLevel: (level: number) => void };
    initialize: (appId: string) => void;
    Notifications: {
      getPermissionAsync: () => Promise<boolean>;
      requestPermission: (fallback: boolean) => Promise<boolean>;
    };
    User: {
      pushSubscription: { getIdAsync: () => Promise<string | null> };
      addTag: (key: string, value: string) => void;
    };
    login: (userId: string) => void;
  };
  LogLevel: { Verbose: number };
}

let OS: OneSignalModule | null = null;

if (!isExpoGo) {
  try {
    OS = require("react-native-onesignal") as OneSignalModule;
  } catch {
    if (__DEV__) {
      console.warn("[OneSignal] Native module not available, features disabled");
    }
  }
}

/**
 * Initializes the OneSignal SDK with the configured app ID.
 * No-op in Expo Go where the native module is unavailable.
 */
export function initOneSignal(): void {
  if (!OS) {
    if (__DEV__) {
      console.warn("[OneSignal] Skipping init — native module not available (Expo Go)");
    }
    return;
  }

  if (!APP_ID) {
    if (__DEV__) {
      console.warn("[OneSignal] No app ID configured");
    }
    return;
  }

  if (__DEV__) {
    OS.OneSignal.Debug.setLogLevel(OS.LogLevel.Verbose);
  }

  OS.OneSignal.initialize(APP_ID);
}

/**
 * Checks if the app currently has push notification permission.
 * Returns false when native module is unavailable.
 */
export async function hasPermission(): Promise<boolean> {
  if (!OS) return false;
  return OS.OneSignal.Notifications.getPermissionAsync();
}

/**
 * Requests push notification permission from the user.
 * Returns false when native module is unavailable.
 */
export async function requestPermission(
  fallbackToSettings = false
): Promise<boolean> {
  if (!OS) return false;
  return OS.OneSignal.Notifications.requestPermission(fallbackToSettings);
}

/**
 * Gets the OneSignal push subscription ID (player ID).
 * Returns null when native module is unavailable.
 */
export async function getPlayerId(): Promise<string | null> {
  if (!OS) return null;
  return OS.OneSignal.User.pushSubscription.getIdAsync();
}

/**
 * Associates an external user ID with the OneSignal device record.
 * No-op when native module is unavailable.
 */
export function setExternalUserId(userId: string): void {
  if (!OS) return;
  OS.OneSignal.login(userId);
}

/**
 * Adds a tag to the OneSignal user for segmentation.
 * No-op when native module is unavailable.
 */
export function sendTag(key: string, value: string): void {
  if (!OS) return;
  OS.OneSignal.User.addTag(key, value);
}
