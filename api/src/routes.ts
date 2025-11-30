import { apiClient } from "./client";
import {
  RoutesDetailsRequest,
  RoutesDetailsResponse,
  RouteShapeResponse,
  RoutesPositionsRequest,
  RoutesPositionsResponse,
} from "./models/routes.types";

/**
 * POST /routes/details
 */
export async function getRouteDetails(
  payload: RoutesDetailsRequest,
): Promise<RoutesDetailsResponse> {
  return apiClient.post<RoutesDetailsResponse>("/routes/details", payload);
}

/**
 * POST /routes/positions
 */
export async function getRoutesPositions(
  payload: RoutesPositionsRequest,
): Promise<RoutesPositionsResponse> {
  return apiClient.post<RoutesPositionsResponse>("/routes/positions", payload);
}

/**
 * GET /routes/shape/{route_id}
 * Retorna o shape (coordenadas) de uma rota.
 */
export async function getRouteShape(
  routeId: string,
): Promise<RouteShapeResponse> {
  return apiClient.get<RouteShapeResponse>(`/routes/shape/${routeId}`);
}
