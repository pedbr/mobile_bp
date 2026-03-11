/**
 * Layout for the authentication route group.
 * Provides a stack navigator with no headers for auth screens.
 * Authenticated users are redirected away by the AuthGuard.
 */

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
