// Re-export all hooks and query utilities

export { queryClient, queryKeys } from "./queryClient";

// User hooks
export { useCurrentUser, useLogin, useLogout, useRegister } from "./useUsers";

// Route hooks
export {
  useBusPositions,
  useFetchBusPositions,
  useRouteShapes,
  useSearchRoutes,
} from "./useRoutes";

// Trip hooks
export { useCreateTrip } from "./useTrips";

// Ranking hooks
export { useGlobalRanking, useUserRanking } from "./useRanking";

// History hooks
export { useUserHistory } from "./useHistory";
