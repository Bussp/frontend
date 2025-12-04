import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTripRequest } from "../models/trips.types";
import { createTrip } from "../requests/trips";
import { queryKeys } from "./queryClient";

/**
 * Hook for creating a new trip.
 *
 * @returns Mutation for creating a trip and calculating score
 *
 * @example
 * ```tsx
 * const { mutate: submitTrip, isPending, data } = useCreateTrip();
 *
 * const handleTripComplete = () => {
 *   submitTrip(
 *     {
 *       route: { bus_line: "809", bus_direction: 1 },
 *       distance: 5000, // meters
 *       trip_datetime: new Date().toISOString(),
 *     },
 *     {
 *       onSuccess: (result) => {
 *         showToast(`You earned ${result.score} points!`);
 *       },
 *     }
 *   );
 * };
 * ```
 */
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTripRequest) => createTrip(payload),
    onSuccess: () => {
      // Invalidate related queries after creating a trip
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.history.user() });
    },
  });
}
