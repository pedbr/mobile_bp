/**
 * Login screen with email/password, Google OAuth, and Apple Sign-In.
 * Uses React Hook Form with Zod validation for the email/password form.
 */

import { View, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { Text, Divider, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import * as analytics from "@/lib/analytics";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      analytics.track("login", { method: "email" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      console.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      analytics.track("login", { method: "google" });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      analytics.track("login", { method: "apple" });
    } catch (error) {
      console.error("Apple sign-in failed:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="mb-10">
            <Text
              variant="headlineLarge"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              Welcome back
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              Sign in to your account to continue
            </Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                errorMessage={errors.email?.message}
                style={{ marginBottom: 12 }}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
                errorMessage={errors.password?.message}
                style={{ marginBottom: 4 }}
              />
            )}
          />

          <Link
            href="/(auth)/forgot-password"
            style={{
              alignSelf: "flex-end",
              marginBottom: 20,
            }}
          >
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.primary }}
            >
              Forgot password?
            </Text>
          </Link>

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            Sign In
          </Button>

          <Divider style={{ marginVertical: 24 }} />

          <View className="gap-3">
            <Button
              mode="outlined"
              icon="google"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              fullWidth
            >
              Continue with Google
            </Button>

            {Platform.OS === "ios" && (
              <Button
                mode="outlined"
                icon="apple"
                onPress={handleAppleSignIn}
                disabled={isLoading}
                fullWidth
              >
                Continue with Apple
              </Button>
            )}
          </View>

          <View className="flex-row justify-center mt-8">
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup">
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.primary, fontWeight: "600" }}
              >
                Sign up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
