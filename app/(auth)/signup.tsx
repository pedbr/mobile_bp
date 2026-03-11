/**
 * Sign-up screen with email/password registration.
 * Uses React Hook Form with Zod for form validation.
 * Includes Google OAuth and Apple Sign-In options.
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

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const theme = useTheme();
  const { signUp, signInWithGoogle, signInWithApple, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signUp(data.email, data.password);
      analytics.track("signup", { method: "email" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign up failed";
      console.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      analytics.track("signup", { method: "google" });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      analytics.track("signup", { method: "apple" });
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
              Create account
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              Start your journey with us today
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
                autoComplete="new-password"
                errorMessage={errors.password?.message}
                style={{ marginBottom: 12 }}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="new-password"
                errorMessage={errors.confirmPassword?.message}
                style={{ marginBottom: 20 }}
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            Create Account
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
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login">
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.primary, fontWeight: "600" }}
              >
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
