/**
 * RevenueCat initialization and helper functions.
 * Handles SDK configuration, entitlement checks, purchases, and user identification.
 *
 * Gracefully degrades in Expo Go where the native store is unavailable —
 * all functions return safe defaults (false, null, empty arrays).
 */

import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import type {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";
const DEFAULT_ENTITLEMENT_ID = "premium";

/**
 * Detect Expo Go via executionEnvironment (most reliable on SDK 55+).
 * Falls back to appOwnership for older SDKs.
 */
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === "expo";

let configured = false;

/**
 * Lazily access the Purchases module. Returns null in Expo Go or if unavailable.
 */
function getPurchases(): typeof import("react-native-purchases").default | null {
  if (isExpoGo) return null;
  try {
    return require("react-native-purchases").default;
  } catch {
    return null;
  }
}

/**
 * Returns true if the key looks like a real RevenueCat API key.
 * Placeholder keys from .env.example are detected and skipped.
 */
function isRealApiKey(key: string): boolean {
  if (!key) return false;
  if (key.includes("your_")) return false;
  if (key === "appl_" || key === "goog_") return false;
  return key.startsWith("appl_") || key.startsWith("goog_");
}

/**
 * Initializes the RevenueCat SDK with the correct platform API key.
 * Skipped in Expo Go and when using placeholder API keys.
 */
export function initRevenueCat(): void {
  if (isExpoGo) {
    if (__DEV__) {
      console.warn("[RevenueCat] Running in Expo Go — purchases disabled");
    }
    return;
  }

  const apiKey = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;

  if (!isRealApiKey(apiKey)) {
    if (__DEV__) {
      console.warn("[RevenueCat] No valid API key for", Platform.OS, "— purchases disabled");
    }
    return;
  }

  const Purchases = getPurchases();
  if (!Purchases) {
    if (__DEV__) {
      console.warn("[RevenueCat] Native module not available, features disabled");
    }
    return;
  }

  try {
    if (__DEV__) {
      const { LOG_LEVEL } = require("react-native-purchases");
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    Purchases.configure({ apiKey });
    configured = true;
  } catch (error) {
    if (__DEV__) {
      console.warn("[RevenueCat] Configure failed:", error);
    }
  }
}

/**
 * Identifies the user in RevenueCat for cross-device entitlement sync.
 * Returns null when not configured.
 */
export async function identifyUser(userId: string): Promise<CustomerInfo | null> {
  const Purchases = configured ? getPurchases() : null;
  if (!Purchases) return null;
  const { customerInfo } = await Purchases.logIn(userId);
  return customerInfo;
}

/**
 * Checks if the user has an active entitlement.
 * Returns { isSubscribed: false } when not configured.
 */
export async function checkEntitlement(
  entitlementId: string = DEFAULT_ENTITLEMENT_ID
): Promise<{ isSubscribed: boolean; customerInfo: CustomerInfo | null }> {
  const Purchases = configured ? getPurchases() : null;
  if (!Purchases) {
    return { isSubscribed: false, customerInfo: null };
  }
  const customerInfo = await Purchases.getCustomerInfo();
  const entitlement = customerInfo.entitlements.active[entitlementId];
  return {
    isSubscribed: entitlement !== undefined,
    customerInfo,
  };
}

/**
 * Fetches current offerings and available packages from RevenueCat.
 * Returns empty results when not configured.
 */
export async function getOfferings(): Promise<{
  offerings: PurchasesOfferings | null;
  packages: PurchasesPackage[];
}> {
  const Purchases = configured ? getPurchases() : null;
  if (!Purchases) {
    return { offerings: null, packages: [] };
  }
  const offerings = await Purchases.getOfferings();
  const packages = offerings?.current?.availablePackages ?? [];
  return { offerings, packages };
}

/**
 * Purchases a specific package and returns the resulting customer info.
 * Returns null when not configured.
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  const Purchases = configured ? getPurchases() : null;
  if (!Purchases) return null;
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

/**
 * Restores previous purchases and returns updated customer info.
 * Returns null when not configured.
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  const Purchases = configured ? getPurchases() : null;
  if (!Purchases) return null;
  return await Purchases.restorePurchases();
}
