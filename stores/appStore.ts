/**
 * Zustand store for general app state.
 * Persists theme preference and onboarding completion to AsyncStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark" | "system";

export interface AppStore {
  theme: Theme;
  hasSeenOnboarding: boolean;
  setTheme: (theme: Theme) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  reset: () => void;
}

const initialState = {
  theme: "system" as Theme,
  hasSeenOnboarding: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),

      reset: () => set(initialState),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
