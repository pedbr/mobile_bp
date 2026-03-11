/**
 * Zustand store for authentication state.
 * Persists session and user to AsyncStorage. Exposes session, user, loading state,
 * and actions to update auth. isAuthenticated is derived from session presence.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  session: null as Session | null,
  user: null as User | null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: session !== null,
        }),

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      reset: () => set(initialState),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        user: state.user,
      }),
    }
  )
);
