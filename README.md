# MyApp Boilerplate

Production-ready React Native / Expo boilerplate with authentication, subscriptions, push notifications, analytics, and more. Fork this for every new app idea.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Expo SDK 55, Expo Router (file-based routing) |
| Language | TypeScript (strict mode) |
| UI | React Native Paper (MD3) + NativeWind (Tailwind) |
| Backend | Supabase (Auth, Database, Storage) |
| Payments | RevenueCat (IAP & Subscriptions) |
| State | Zustand (client) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Analytics | PostHog |
| Crash Reporting | Sentry |
| Push Notifications | OneSignal |
| Build & Deploy | EAS Build / Submit / Update |

## Project Structure

```
├── app/
│   ├── (auth)/              # Auth route group (login, signup, forgot-password)
│   ├── (tabs)/              # Main app tabs (home, settings)
│   ├── onboarding/          # First-launch onboarding flow
│   ├── _layout.tsx          # Root layout with all providers
│   └── index.tsx            # Entry redirect (onboarding → auth → home)
├── components/
│   ├── ui/                  # Reusable primitives (Button, Card, Input, LoadingScreen)
│   ├── auth/                # AuthGuard for protected routes
│   ├── paywall/             # Subscription paywall screen
│   └── onboarding/          # Onboarding slide component
├── lib/
│   ├── supabase.ts          # Supabase client with AsyncStorage persistence
│   ├── revenuecat.ts        # RevenueCat init, purchases, entitlements
│   ├── analytics.ts         # PostHog wrapper (identify, track, screen)
│   ├── sentry.ts            # Sentry init, error boundary, capture helpers
│   ├── onesignal.ts         # OneSignal push notification setup
│   └── queryClient.ts       # TanStack Query client configuration
├── hooks/
│   ├── useAuth.ts           # Auth state, sign in/up/out, OAuth, account deletion
│   ├── useSubscription.ts   # RevenueCat entitlements and purchase actions
│   └── usePushNotifications.ts  # Permission state and player ID sync
├── stores/
│   ├── authStore.ts         # Zustand auth state (persisted)
│   └── appStore.ts          # Zustand app state (theme, onboarding)
├── types/
│   ├── supabase.ts          # Database schema types
│   └── index.ts             # Shared TypeScript types
├── constants/
│   ├── colors.ts            # MD3 light/dark themes + brand colors
│   ├── fonts.ts             # Typography scale
│   └── config.ts            # Environment variables and app constants
└── assets/
    ├── images/              # App icons, splash, onboarding images
    └── fonts/               # Inter font files (Regular, Medium, Bold)
```

## Setup Guide

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- iOS: Xcode (for simulators and builds)
- Android: Android Studio (for emulators and builds)

### 1. Clone and Install

```bash
git clone <your-repo-url> myapp
cd myapp
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your_key
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your_key
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/123
EXPO_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-id
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL below in the Supabase SQL Editor to create the `profiles` table
3. Enable **Email/Password** auth in Authentication → Providers
4. Enable **Google** OAuth:
   - Add your Google OAuth credentials in Authentication → Providers → Google
   - Add redirect URL: `myapp://auth/callback`
5. Enable **Apple** Sign-In:
   - Add your Apple Sign-In credentials in Authentication → Providers → Apple
6. Add `myapp://auth/callback` to Authentication → URL Configuration → Redirect URLs

### 4. Supabase SQL Setup

Run this in your Supabase SQL Editor:

```sql
-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  onesignal_player_id TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to delete user account (callable via supabase.rpc('delete_user'))
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

### 5. Configure RevenueCat

1. Create a project at [revenuecat.com](https://www.revenuecat.com)
2. Add your iOS app (App Store Connect) and Android app (Google Play Console)
3. Create an entitlement called `premium`
4. Create products and offerings
5. Copy API keys to your `.env`

### 6. Configure PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Create a project and copy the API key to `.env`
3. Screen views are auto-tracked via the tabs layout

### 7. Configure Sentry

1. Create a project at [sentry.io](https://sentry.io)
2. Select React Native as the platform
3. Copy the DSN to `.env`
4. Update `app.config.ts` with your Sentry organization and project names

### 8. Configure OneSignal

1. Create an app at [onesignal.com](https://onesignal.com)
2. Configure iOS (APNs) and Android (FCM) push credentials
3. Copy the App ID to `.env`

### 9. Add Font Files

Download [Inter from Google Fonts](https://fonts.google.com/specimen/Inter) and place:
- `Inter-Regular.ttf` → `assets/fonts/Inter-Regular.ttf`
- `Inter-Medium.ttf` → `assets/fonts/Inter-Medium.ttf`
- `Inter-Bold.ttf` → `assets/fonts/Inter-Bold.ttf`

### 10. Replace Placeholder Images

Replace the placeholder PNGs in `assets/images/` with your actual:
- `icon.png` (1024x1024) — App icon
- `splash-icon.png` (200x200) — Splash screen icon
- `adaptive-icon.png` (1024x1024) — Android adaptive icon
- `favicon.png` (48x48) — Web favicon
- `notification-icon.png` (96x96) — Push notification icon
- `onboarding-1.png`, `onboarding-2.png`, `onboarding-3.png` — Onboarding slides

## Running Locally

```bash
# Start Expo dev server
npx expo start

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android

# Create a development build (required for native modules)
npx expo run:ios
npx expo run:android
```

> **Note:** RevenueCat, OneSignal, and Apple Sign-In require a development build (not Expo Go) because they use native modules.

## Building with EAS

```bash
# Login to EAS
eas login

# Configure EAS (first time)
eas build:configure

# Development build (internal distribution)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA update
eas update --branch production --message "Bug fixes"
```

## Deep Linking

The app scheme is configured as `myapp://`. Expo Router handles deep links automatically.

**Supabase OAuth redirects** use `myapp://auth/callback` — make sure this is added to your Supabase project's redirect URLs.

To test deep links:

```bash
# iOS
npx uri-scheme open "myapp://settings" --ios

# Android
npx uri-scheme open "myapp://settings" --android
```

## Customization Checklist

When forking this boilerplate for a new app:

- [ ] Update `APP_NAME`, `BUNDLE_ID`, `SCHEME` in `constants/config.ts`
- [ ] Update `name`, `slug`, `scheme`, `bundleIdentifier`, `package` in `app.config.ts`
- [ ] Update `eas.json` with your Apple Team ID and Google Play credentials
- [ ] Replace all placeholder images in `assets/images/`
- [ ] Add real Inter font files to `assets/fonts/`
- [ ] Fill in `.env` with real API keys
- [ ] Run the Supabase SQL setup
- [ ] Configure RevenueCat products and entitlements
- [ ] Set up Sentry project and upload source maps
- [ ] Configure OneSignal with push credentials
- [ ] Update `SUPPORT_EMAIL`, `PRIVACY_POLICY_URL`, `TERMS_URL` in `constants/config.ts`
- [ ] Generate typed Supabase types: `npx supabase gen types typescript --project-id <id> > types/supabase.ts`

## Architecture Decisions

- **Zustand + AsyncStorage** for client state that persists across sessions (auth tokens, theme preference, onboarding status)
- **TanStack Query** for server state (API data fetching with caching, refetching, and optimistic updates)
- **React Native Paper** for accessible, Material Design 3 components with theming
- **NativeWind** alongside Paper for utility-class layout (flexbox, spacing, sizing) while Paper handles component styling
- **Expo Router** for file-based routing with type-safe navigation and automatic deep linking
- **AuthGuard** at the root layout level handles all auth redirects centrally
- **Env vars** use Expo's built-in `EXPO_PUBLIC_*` convention — no extra config packages needed

## License

MIT
