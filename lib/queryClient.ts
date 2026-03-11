/**
 * TanStack Query (React Query) client configuration.
 * Provides a centralized QueryClient with sensible defaults for React Native.
 */
import { QueryClient } from '@tanstack/react-query';

/** Stale time: 5 minutes. Data is considered fresh for this duration. */
const STALE_TIME = 5 * 60 * 1000;

/** Garbage collection time: 10 minutes. Unused data is kept in cache for this duration. */
const GC_TIME = 10 * 60 * 1000;

/**
 * Pre-configured QueryClient for React Native/Expo apps.
 * Defaults: 5min stale, 10min gc, 2 retries for queries, 1 for mutations,
 * refetchOnWindowFocus disabled (better for mobile).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
