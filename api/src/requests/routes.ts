import { apiClient } from "../client";
import type {
  BusPositionsRequest,
  BusPositionsResponse,
  RouteSearchResponse,
  RouteShapesRequest,
  RouteShapesResponse,
} from "../models/routes.types";

/**
 * GET /routes/search
 * Searches for bus routes matching a query string.
 *
 * @param query - Search term (e.g., "809" or "Vila Nova Conceição")
 */
export async function searchRoutes(
  query: string
): Promise<RouteSearchResponse> {
  return apiClient.get<RouteSearchResponse>("/routes/search", {
    params: { query },
  });
}

/**
 * POST /routes/positions
 * Gets real-time bus positions for specified routes.
 *
 * @param payload - Request containing list of route_ids
 */
export async function getBusPositions(
  payload: BusPositionsRequest
): Promise<BusPositionsResponse> {
  return apiClient.post<BusPositionsResponse>("/routes/positions", payload);
}

/**
 * POST /routes/shapes
 * Gets the geographic shapes (coordinates) for multiple routes from GTFS data.
 *
 * @param payload - Request containing list of route identifiers (bus_line and direction)
 */
export async function getRouteShapes(
  payload: RouteShapesRequest
): Promise<RouteShapesResponse> {
  return apiClient.post<RouteShapesResponse>("/routes/shapes", payload);
}
