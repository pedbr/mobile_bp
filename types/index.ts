/**
 * Global shared types used across the application.
 * Exports types for auth state, subscription state, onboarding,
 * and theme preferences.
 */

import type { User, Session } from '@supabase/supabase-js';
import type { ImageSourcePropType } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

/** Authentication state shape for the auth store/context */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/** Subscription state from RevenueCat */
export interface SubscriptionState {
  isSubscribed: boolean;
  activeEntitlement: string | null;
  availablePackages: PurchasesPackage[];
}

/** Single slide in the onboarding flow */
export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

/** Theme preference - light, dark, or follow system */
export type Theme = 'light' | 'dark' | 'system';
