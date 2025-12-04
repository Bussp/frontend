import { apiClient } from "../client";
import type {
  CreateTripRequest,
  CreateTripResponse,
} from "../models/trips.types";

/**
 * POST /trips/
 * Creates a new trip and calculates the score.
 *
 * @param payload - Trip creation request with route, distance, and datetime
 */
export async function createTrip(
  payload: CreateTripRequest
): Promise<CreateTripResponse> {
  return apiClient.post<CreateTripResponse>("/trips/", payload);
}
