/**
 * App-wide constants and environment configuration.
 * All EXPO_PUBLIC_* env vars are inlined at build time by Expo's Metro transformer.
 */

export const APP_NAME = "MyApp" as const;
export const BUNDLE_ID = "com.yourcompany.appname" as const;
export const SCHEME = "myapp" as const;

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
export const REVENUECAT_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? "";
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";
export const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

export const SUPPORT_EMAIL = "support@yourcompany.com" as const;
export const PRIVACY_POLICY_URL = "https://yourcompany.com/privacy-policy" as const;
export const TERMS_URL = "https://yourcompany.com/terms" as const;
