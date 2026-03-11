/**
 * OneSignal push notification setup and helper functions.
 * Handles SDK initialization, permission management, and player ID retrieval.
 */

import { OneSignal, LogLevel } from "react-native-onesignal";

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

/**
 * Initializes the OneSignal SDK with the configured app ID.
 * Sets verbose logging in development. Does not request permission immediately —
 * call requestPermission() on a meaningful user interaction instead.
 */
export function initOneSignal(): void {
  if (!APP_ID) {
    if (__DEV__) {
      console.warn("[OneSignal] No app ID configured");
    }
    return;
  }

  if (__DEV__) {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  }

  OneSignal.initialize(APP_ID);
}

/**
 * Checks if the app currently has push notification permission.
 */
export async function hasPermission(): Promise<boolean> {
  return OneSignal.Notifications.getPermissionAsync();
}

/**
 * Requests push notification permission from the user.
 * @param fallbackToSettings If true, prompts user to open Settings when previously denied
 */
export async function requestPermission(
  fallbackToSettings = false
): Promise<boolean> {
  return OneSignal.Notifications.requestPermission(fallbackToSettings);
}

/**
 * Gets the OneSignal push subscription ID (player ID).
 * Returns null if the user hasn't opted in or SDK isn't initialized.
 */
export async function getPlayerId(): Promise<string | null> {
  return OneSignal.User.pushSubscription.getIdAsync();
}

/**
 * Associates an external user ID with the OneSignal device record.
 * Call after authentication to link push tokens to your user.
 */
export function setExternalUserId(userId: string): void {
  OneSignal.login(userId);
}

/**
 * Adds a tag to the OneSignal user for segmentation.
 */
export function sendTag(key: string, value: string): void {
  OneSignal.User.addTag(key, value);
}
