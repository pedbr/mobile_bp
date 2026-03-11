/**
 * Sentry error tracking and crash reporting initialization.
 * Provides init, ErrorBoundary, captureException, setUser, and wrap utilities.
 */
import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

/**
 * Initializes the Sentry SDK for React Native.
 * Uses higher trace sampling in dev (1.0) and lower in prod (0.2).
 */
export function initSentry(): void {
  if (!dsn) {
    if (__DEV__) {
      console.warn('[Sentry] No DSN configured');
    }
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    debug: __DEV__,
  });
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
 * Use to wrap your app's root component for automatic error boundary and tracing.
 */
export const wrapWithSentry = Sentry.wrap;
