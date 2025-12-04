import { useQuery } from "@tanstack/react-query";
import { getUserHistory } from "../requests/history";
import { queryKeys } from "./queryClient";

/**
 * Hook for fetching the current user's trip history.
 *
 * @param options - Additional query options
 * @returns Query result with user's trip history
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useUserHistory();
 *
 * return (
 *   <FlatList
 *     data={data?.trips}
 *     renderItem={({ item }) => (
 *       <TripHistoryItem
 *         date={item.date}
 *         score={item.score}
 *         route={item.route}
 *       />
 *     )}
 *     onRefresh={refetch}
 *   />
 * );
 * ```
 */
export function useUserHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.history.user(),
    queryFn: getUserHistory,
    staleTime: 60 * 1000, // History is fresh for 1 minute
    ...options,
  });
}
