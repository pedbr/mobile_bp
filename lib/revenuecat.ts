/**
 * RevenueCat initialization and helper functions.
 * Handles SDK configuration, entitlement checks, purchases, and user identification.
 */

import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";
const DEFAULT_ENTITLEMENT_ID = "premium";

/**
 * Initializes the RevenueCat SDK with the correct platform API key.
 * Sets log level to DEBUG in development for easier debugging.
 * Safe to call multiple times — noop if already configured.
 */
export function initRevenueCat(): void {
  const apiKey = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;

  if (!apiKey) {
    if (__DEV__) {
      console.warn("[RevenueCat] No API key configured for", Platform.OS);
    }
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
}

/**
 * Identifies the user in RevenueCat for cross-device entitlement sync.
 * Call after successful authentication.
 */
export async function identifyUser(userId: string): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.logIn(userId);
  return customerInfo;
}

/**
 * Checks if the user has an active entitlement.
 * @param entitlementId Defaults to "premium"
 */
export async function checkEntitlement(
  entitlementId: string = DEFAULT_ENTITLEMENT_ID
): Promise<{ isSubscribed: boolean; customerInfo: CustomerInfo }> {
  const customerInfo = await Purchases.getCustomerInfo();
  const entitlement = customerInfo.entitlements.active[entitlementId];
  return {
    isSubscribed: entitlement !== undefined,
    customerInfo,
  };
}

/**
 * Fetches current offerings and available packages from RevenueCat.
 */
export async function getOfferings(): Promise<{
  offerings: PurchasesOfferings | null;
  packages: PurchasesPackage[];
}> {
  const offerings = await Purchases.getOfferings();
  const packages = offerings?.current?.availablePackages ?? [];
  return { offerings, packages };
}

/**
 * Purchases a specific package and returns the resulting customer info.
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

/**
 * Restores previous purchases and returns updated customer info.
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  return await Purchases.restorePurchases();
}
