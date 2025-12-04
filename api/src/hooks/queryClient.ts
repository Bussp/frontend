import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      // Consider data fresh for 30 seconds
      staleTime: 30 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Don't refetch on window focus for mobile (can be battery intensive)
      refetchOnWindowFocus: false,
      // Refetch on reconnect by default
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Query keys factory for consistent cache key management.
 * Using a factory pattern ensures consistent keys across the app.
 */
export const queryKeys = {
  users: {
    all: ["users"] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
  },

  routes: {
    all: ["routes"] as const,
    search: (query: string) =>
      [...queryKeys.routes.all, "search", query] as const,
    positions: (routeIds: number[]) =>
      [...queryKeys.routes.all, "positions", ...routeIds.map(String)] as const,
    shapes: (routes: Array<{ bus_line: string; bus_direction: number }>) =>
      [...queryKeys.routes.all, "shapes", JSON.stringify(routes)] as const,
  },

  ranking: {
    all: ["ranking"] as const,
    user: () => [...queryKeys.ranking.all, "user"] as const,
    global: () => [...queryKeys.ranking.all, "global"] as const,
  },

  history: {
    all: ["history"] as const,
    user: () => [...queryKeys.history.all, "user"] as const,
  },

  trips: {
    all: ["trips"] as const,
  },
} as const;
