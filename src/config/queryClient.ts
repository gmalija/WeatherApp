import {QueryClient} from '@tanstack/react-query';

/**
 * React Query configuration for server state management
 * Handles caching, refetching, and invalidation for all API calls
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes for weather data)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry delay with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for weather data freshness)
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Query keys factory for consistent cache key management
 */
export const queryKeys = {
  weather: {
    all: ['weather'] as const,
    byLocation: (lat: number, lon: number, providerId: string) =>
      [...queryKeys.weather.all, 'location', {lat, lon, providerId}] as const,
    current: () => [...queryKeys.weather.all, 'current'] as const,
  },
  location: {
    all: ['location'] as const,
    search: (query: string) =>
      [...queryKeys.location.all, 'search', query] as const,
    current: () => [...queryKeys.location.all, 'current'] as const,
  },
} as const;
