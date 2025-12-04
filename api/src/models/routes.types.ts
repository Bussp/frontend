import type { Coordinate, RouteIdentifier } from "./common.types";

export { Coordinate, RouteIdentifier };

export interface BusRouteRequest {
  route_id: number;
}

export interface BusRouteResponse {
  route_id: number;
  route: RouteIdentifier;
  is_circular: boolean;
  terminal_name: string;
}

export interface BusPosition {
  route_id: number;
  position: Coordinate;
  time_updated: string; // ISO datetime
}

/**
 * Request for POST /routes/positions.
 */
export interface BusPositionsRequest {
  routes: BusRouteRequest[];
}

/**
 * Response from POST /routes/positions.
 */
export interface BusPositionsResponse {
  buses: BusPosition[];
}

/**
 * Response from GET /routes/search.
 */
export interface RouteSearchResponse {
  routes: BusRouteResponse[];
}

export interface RouteShapeResponse {
  route: RouteIdentifier;
  shape_id: string;
  points: Coordinate[];
}

/**
 * Request for POST /routes/shapes.
 */
export interface RouteShapesRequest {
  routes: RouteIdentifier[];
}

/**
 * Response from POST /routes/shapes.
 */
export interface RouteShapesResponse {
  shapes: RouteShapeResponse[];
}


