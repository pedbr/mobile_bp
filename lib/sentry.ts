/**
 * Sentry error tracking and crash reporting initialization.
 * Provides init, ErrorBoundary, captureException, setUser, and wrap utilities.
 */
import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";

const DSN_REGEX = /^https:\/\/[a-f0-9]+@[a-z0-9.-]+\.sentry\.io\/\d+$/i;

/**
 * Initializes the Sentry SDK for React Native.
 * Validates the DSN format before init to prevent noisy errors with placeholder values.
 */
export function initSentry(): void {
  if (!dsn || !DSN_REGEX.test(dsn)) {
    if (__DEV__) {
      console.warn("[Sentry] DSN missing or invalid, skipping init");
    }
    return;
  }

  try {
    Sentry.init({
      dsn,
      tracesSampleRate: __DEV__ ? 1.0 : 0.2,
      enableAutoSessionTracking: true,
      debug: __DEV__,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn("[Sentry] Init failed:", error);
    }
  }
}

/**
 * Sentry Error Boundary component for catching React render errors.
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * Captures an exception and optionally attaches context.
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
): string | undefined {
  if (context && Object.keys(context).length > 0) {
    return Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      return Sentry.captureException(error);
    });
  }
  return Sentry.captureException(error);
}

/**
 * Sets the current user for error attribution.
 */
export function setUser(userId: string, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
  });
}

/**
 * Wraps the root component with Sentry instrumentation.
 */
export const wrapWithSentry = Sentry.wrap;
