/**
 * RevenueCat entitlements and paywall trigger hook.
 * Tracks subscription status, available packages, and provides purchase/restore actions.
 * All calls go through the guarded lib/revenuecat helpers for Expo Go safety.
 */

import { useState, useEffect, useCallback } from "react";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import {
  checkEntitlement,
  getOfferings,
  purchasePackage as purchasePkg,
  restorePurchases as restorePkg,
} from "@/lib/revenuecat";

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [availablePackages, setAvailablePackages] = useState<PurchasesPackage[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [entitlementResult, offeringsResult] = await Promise.all([
        checkEntitlement(),
        getOfferings(),
      ]);
      setIsSubscribed(entitlementResult.isSubscribed);
      setCustomerInfo(entitlementResult.customerInfo);
      setAvailablePackages(offeringsResult.packages);
    } catch (error) {
      if (__DEV__) {
        console.warn("[useSubscription] refresh failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      const info = await purchasePkg(pkg);
      if (info) {
        setCustomerInfo(info);
        const { isSubscribed: subscribed } = await checkEntitlement();
        setIsSubscribed(subscribed);
      }
    },
    []
  );

  const restore = useCallback(async () => {
    const info = await restorePkg();
    if (info) {
      setCustomerInfo(info);
      const { isSubscribed: subscribed } = await checkEntitlement();
      setIsSubscribed(subscribed);
    }
  }, []);

  return {
    isSubscribed,
    availablePackages,
    isLoading,
    customerInfo,
    purchase,
    restore,
    refresh,
  };
}
