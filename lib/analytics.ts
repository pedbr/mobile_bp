/**
 * PostHog analytics wrapper for product analytics, feature flags, and session replay.
 * Provides typed helpers for identify, track, screen, and reset operations.
 */
import PostHog from 'posthog-react-native';
import type { PostHogEventProperties } from '@posthog/core';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';

/**
 * PostHog client instance configured for the US cloud region.
 * Create a single instance for app-wide analytics.
 */
export const posthog = new PostHog(apiKey, {
  host: 'https://us.i.posthog.com',
});

/**
 * Associates the current user with a distinct ID and optional properties.
 */
export function identify(
  userId: string,
  properties?: Record<string, unknown>
): void {
  posthog.identify(userId, properties as PostHogEventProperties | undefined);
}

/**
 * Tracks a custom event with optional properties.
 */
export function track(
  event: string,
  properties?: Record<string, unknown>
): void {
  posthog.capture(event, properties as PostHogEventProperties | undefined);
}

/**
 * Tracks a screen view with optional properties.
 */
export function screen(
  screenName: string,
  properties?: Record<string, unknown>
): void {
  posthog.screen(screenName, properties as PostHogEventProperties | undefined);
}

/**
 * Resets the user identity (e.g. on logout).
 * Clears distinct ID, anonymous ID, and super properties.
 */
export function reset(): void {
  posthog.reset();
}
