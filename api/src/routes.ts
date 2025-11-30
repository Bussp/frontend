import { apiClient } from "./client";
import {
  RoutesDetailsRequest,
  RoutesDetailsResponse,
  RoutesPositionsRequest,
  RoutesPositionsResponse,
} from "./models/routes.types";

/**
 * POST /routes/details
 * Resolve as rotas concretas (route_id + bus_line).
 */
export async function getRouteDetails(
  payload: RoutesDetailsRequest,
): Promise<RoutesDetailsResponse> {
  return apiClient.post<RoutesDetailsResponse>("/routes/details", payload);
}

/**
 * POST /routes/positions
 * Recupera as posições dos ônibus para rotas já resolvidas (BusRoute[]).
 */
export async function getRoutesPositions(
  payload: RoutesPositionsRequest,
): Promise<RoutesPositionsResponse> {
  return apiClient.post<RoutesPositionsResponse>("/routes/positions", payload);
}
