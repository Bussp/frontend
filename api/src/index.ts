// api/src/index.ts
// Main entry point for the API module

// Client
export { apiClient } from "./client";

// Providers
export { QueryProvider } from "./providers";

// Hooks (recommended for components)
export {
  // Query utilities
  queryClient,
  queryKeys,
  useBusPositions,
  // Trip hooks
  useCreateTrip,
  // User hooks
  useCurrentUser,
  useFetchBusPositions,
  useGlobalRanking,
  useLogin,
  useLogout,
  useRegister,
  useRouteShapes,
  // Route hooks
  useSearchRoutes,
  // History hooks
  useUserHistory,
  // Ranking hooks
  useUserRanking,
} from "./hooks";

// Request functions (prefer to use hooks on components)
export {
  // Trips
  createTrip,
  getBusPositions,
  getCurrentUser,
  getGlobalRanking,
  getRouteShapes,
  // History
  getUserHistory,
  // Ranking
  getUserRanking,
  loginUser,
  logoutUser,
  // Users
  registerUser,
  // Routes
  searchRoutes,
} from "./requests";

// Types
export type {
  // Common
  Coordinate,
  RouteIdentifier,
} from "./models/common.types";

export type {
  TokenResponse,
  // Users
  User,
  UserCreateAccountRequest,
} from "./models/users.types";

export type {
  BusPosition,
  BusPositionsRequest,
  BusPositionsResponse,
  // Routes
  BusRouteRequest,
  BusRouteResponse,
  RouteSearchResponse,
  RouteShapeResponse,
  RouteShapesRequest,
  RouteShapesResponse,
} from "./models/routes.types";

export type {
  // Trips
  CreateTripRequest,
  CreateTripResponse,
} from "./models/trips.types";

export type {
  GlobalRankingResponse,
  // Ranking
  UserRankingResponse,
} from "./models/ranking.types";

export type {
  HistoryResponse,
  // History
  TripHistoryEntry,
} from "./models/history.types";
