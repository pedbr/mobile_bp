/**
 * Paywall screen component for subscription purchases.
 * Displays available packages, handles purchases and restoration via RevenueCat.
 */
import {
  Card,
  Button,
  LoadingScreen,
} from '@/components/ui';
import { useSubscription } from '@/hooks/useSubscription';
import type { PurchasesPackage } from 'react-native-purchases';
import type React from 'react';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Chip,
  Text,
  useTheme,
} from 'react-native-paper';

export interface PaywallScreenProps {
  /** Called when the user closes the paywall (e.g. modal dismissal) */
  onClose?: () => void;
}

function getPackageTitle(pkg: PurchasesPackage): string {
  const type = String(pkg.packageType).toUpperCase();
  if (type.includes('ANNUAL') || type === 'ANNUAL') return 'Annual';
  if (type.includes('MONTHLY') || type === 'MONTHLY') return 'Monthly';
  if (type.includes('WEEKLY') || type === 'WEEKLY') return 'Weekly';
  if (type.includes('LIFETIME') || type === 'LIFETIME') return 'Lifetime';
  return pkg.product.title;
}

function isAnnualPackage(pkg: PurchasesPackage): boolean {
  const type = String(pkg.packageType).toUpperCase();
  return type.includes('ANNUAL') || type === 'ANNUAL';
}

/**
 * Renders a paywall with subscription options.
 * Shows loading state, package cards with subscribe buttons, restore purchases,
 * and a subscribed state when the user already has access.
 */
export function PaywallScreen({
  onClose,
}: PaywallScreenProps): React.ReactElement {
  const theme = useTheme();
  const {
    availablePackages: packages,
    isLoading,
    isSubscribed,
    purchase,
    restore,
  } = useSubscription();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = useCallback(
    async (pkg: PurchasesPackage) => {
      setPurchasingId(pkg.identifier);
      try {
        await purchase(pkg);
      } finally {
        setPurchasingId(null);
      }
    },
    [purchase]
  );

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      await restore();
    } finally {
      setRestoring(false);
    }
  }, [restore]);

  if (isLoading) {
    return <LoadingScreen message="Loading plans…" />;
  }

  if (isSubscribed) {
    return (
      <View style={styles.subscribedContainer}>
        <Text variant="headlineMedium" style={styles.subscribedTitle}>
          You're subscribed!
        </Text>
        <Text
          variant="bodyMedium"
          style={[
            styles.subscribedSubtitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Thank you for your support.
        </Text>
        {onClose ? (
          <Button onPress={onClose} mode="outlined">
            Close
          </Button>
        ) : null}
      </View>
    );
  }

  const monthlyPkg = packages.find((p: PurchasesPackage) =>
    String(p.packageType).toUpperCase().includes('MONTHLY')
  );
  const annualPkg = packages.find((p: PurchasesPackage) => isAnnualPackage(p));
  const displayPackages = [
    ...(monthlyPkg ? [monthlyPkg] : []),
    ...(annualPkg ? [annualPkg] : []),
  ].filter((p): p is PurchasesPackage => Boolean(p));
  const remainingPackages = packages.filter(
    (p: PurchasesPackage) => !displayPackages.includes(p)
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Choose your plan
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        Unlock all features with a subscription.
      </Text>

      <View style={styles.packagesContainer}>
        {displayPackages.map((pkg) => (
          <Card key={pkg.identifier}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{getPackageTitle(pkg)}</Text>
                {isAnnualPackage(pkg) ? (
                  <Chip compact>Best value</Chip>
                ) : null}
              </View>
              <Text variant="headlineSmall" style={styles.cardPrice}>
                {pkg.product.priceString}
              </Text>
              {pkg.product.description ? (
                <Text
                  variant="bodySmall"
                  style={[
                    styles.cardDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {pkg.product.description}
                </Text>
              ) : null}
              <Button
                mode="contained"
                onPress={() => void handlePurchase(pkg)}
                loading={purchasingId === pkg.identifier}
                disabled={purchasingId !== null}
              >
                Subscribe
              </Button>
            </Card.Content>
          </Card>
        ))}
        {remainingPackages.map((pkg: PurchasesPackage) => (
          <Card key={pkg.identifier}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {getPackageTitle(pkg)}
              </Text>
              <Text variant="headlineSmall" style={styles.cardPrice}>
                {pkg.product.priceString}
              </Text>
              {pkg.product.description ? (
                <Text
                  variant="bodySmall"
                  style={[
                    styles.cardDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {pkg.product.description}
                </Text>
              ) : null}
              <Button
                mode="contained"
                onPress={() => void handlePurchase(pkg)}
                loading={purchasingId === pkg.identifier}
                disabled={purchasingId !== null}
              >
                Subscribe
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Button
        mode="text"
        onPress={() => void handleRestore()}
        loading={restoring}
        disabled={restoring}
        style={styles.restoreButton}
      >
        Restore Purchases
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardPrice: {
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 16,
  },
  packagesContainer: {
    gap: 16,
  },
  subscribedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  subscribedTitle: {
    marginBottom: 8,
  },
  subscribedSubtitle: {
    marginBottom: 24,
  },
  restoreButton: {
    marginTop: 24,
  },
});
