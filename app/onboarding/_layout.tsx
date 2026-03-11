/**
 * Layout for the onboarding flow.
 * Simple stack navigator with no headers, used for the swipeable onboarding screens.
 */

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}
