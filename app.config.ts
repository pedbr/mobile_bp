/**
 * Expo app configuration using the dynamic config format.
 * Reads environment variables from .env via Expo's built-in dotenv support.
 * All sensitive keys are accessed via process.env.EXPO_PUBLIC_* variables.
 */
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "MyApp",
  slug: "myapp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.appname",
    usesAppleSignIn: true,
    googleServicesFile: "./GoogleService-Info.plist",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yourcompany.appname",
    googleServicesFile: "./google-services.json",
    permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    "expo-apple-authentication",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#6366f1",
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        organization: "your-org",
        project: "your-project",
      },
    ],
    [
      "react-native-onesignal",
      {
        mode: "development",
      },
    ],
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    revenuecatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
    revenuecatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
    posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    onesignalAppId: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
    eas: {
      projectId: "your-eas-project-id",
    },
  },
  updates: {
    url: "https://u.expo.dev/your-eas-project-id",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
