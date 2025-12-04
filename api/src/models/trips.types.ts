import type { RouteIdentifier } from "./common.types";

/**
 * Request body for POST /trips/.
 */
export interface CreateTripRequest {
  route: RouteIdentifier;
  distance: number;
  trip_datetime: string; // ISO datetime string
}

/**
 * Response from POST /trips/.
 */
export interface CreateTripResponse {
  score: number;
}
