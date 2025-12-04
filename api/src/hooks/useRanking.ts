import { useQuery } from "@tanstack/react-query";
import { getGlobalRanking, getUserRanking } from "../requests/ranking";
import { queryKeys } from "./queryClient";

/**
 * Hook for fetching the current user's ranking position.
 *
 * @param options - Additional query options
 * @returns Query result with user's ranking position
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useUserRanking();
 *
 * return (
 *   <Text>Your position: #{data?.position}</Text>
 * );
 * ```
 */
export function useUserRanking(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.ranking.user(),
    queryFn: getUserRanking,
    staleTime: 60 * 1000, // Rankings are fresh for 1 minute
    ...options,
  });
}

/**
 * Hook for fetching the global leaderboard.
 *
 * @param options - Additional query options
 * @returns Query result with all users sorted by score
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useGlobalRanking();
 *
 * return (
 *   <FlatList
 *     data={data?.users}
 *     renderItem={({ item, index }) => (
 *       <LeaderboardItem
 *         position={index + 1}
 *         name={item.name}
 *         score={item.score}
 *       />
 *     )}
 *     onRefresh={refetch}
 *   />
 * );
 * ```
 */
export function useGlobalRanking(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.ranking.global(),
    queryFn: getGlobalRanking,
    staleTime: 60 * 1000, // Rankings are fresh for 1 minute
    ...options,
  });
}
