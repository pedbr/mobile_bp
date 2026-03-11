/**
 * Forgot password screen that sends a password reset email via Supabase.
 * Uses React Hook Form with Zod validation for the email field.
 */

import { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  if (emailSent) {
    return (
      <View
        className="flex-1 justify-center px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <View className="items-center">
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.primary, fontWeight: "700" }}
          >
            Check your email
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
              marginTop: 12,
              marginBottom: 32,
            }}
          >
            We sent a password reset link to{"\n"}
            <Text style={{ fontWeight: "600" }}>{getValues("email")}</Text>
          </Text>
          <Button onPress={() => router.back()} fullWidth>
            Back to Sign In
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-10">
          <Text
            variant="headlineLarge"
            style={{ color: theme.colors.primary, fontWeight: "700" }}
          >
            Reset password
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
          >
            Enter your email and we'll send you a reset link
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
          Send Reset Link
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          Back to Sign In
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
