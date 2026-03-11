/**
 * Auth hook using Supabase. Provides session management, sign in/up,
 * OAuth (Google, Apple), sign out, password reset, and account deletion.
 */

import { useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { SCHEME } from "@/constants/config";
import { createURL } from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

function createRedirectUri(): string {
  return createURL("auth/callback", { scheme: SCHEME });
}

async function createSessionFromUrl(url: string) {
  const parsed = new URL(url);
  const hash = parsed.hash.slice(1);
  const params = new URLSearchParams(hash || parsed.search);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const errorCode = params.get("error");

  if (errorCode) {
    throw new Error(params.get("error_description") ?? errorCode);
  }
  if (!accessToken) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken ?? "",
  });
  if (error) throw error;
  return data.session;
}

export function useAuth() {
  useRouter(); // Required import; use for post-auth redirects if needed
  const {
    session,
    user,
    isLoading,
    setSession,
    setUser,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSession(data.session);
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading]
  );

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = createRedirectUri();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (!data?.url) return;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === "success" && result.url) {
        await createSessionFromUrl(result.url);
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const signInWithApple = useCallback(async () => {
    if (Platform.OS !== "ios") {
      throw new Error("Sign in with Apple is only available on iOS");
    }
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) throw error;
      setSession(data.session);
    } finally {
      setLoading(false);
    }
  }, [setSession, setLoading]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setSession, setUser, setLoading]);

  const resetPassword = useCallback(
    async (email: string) => {
      const redirectTo = createRedirectUri();
      await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    },
    []
  );

  const deleteAccount = useCallback(async () => {
    try {
      await supabase.rpc("delete_user");
    } finally {
      await signOut();
    }
  }, [signOut]);

  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    deleteAccount,
  };
}
