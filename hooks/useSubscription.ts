/**
 * RevenueCat entitlements and paywall trigger hook.
 * Tracks subscription status, available packages, and provides purchase/restore actions.
 */

import { useState, useEffect, useCallback } from "react";
import Purchases, {
  type CustomerInfo,
  type PurchasesPackage,
} from "react-native-purchases";
import {
  checkEntitlement,
  getOfferings,
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      const result = await Purchases.purchasePackage(pkg);
      if (result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        const { isSubscribed: subscribed } = await checkEntitlement();
        setIsSubscribed(subscribed);
      }
    },
    []
  );

  const restore = useCallback(async () => {
    const info = await Purchases.restorePurchases();
    setCustomerInfo(info);
    const { isSubscribed: subscribed } = await checkEntitlement();
    setIsSubscribed(subscribed);
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
