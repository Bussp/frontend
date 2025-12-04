import type { RouteIdentifier } from "./common.types";

export interface TripHistoryEntry {
  date: string; // ISO datetime
  score: number;
  route: RouteIdentifier;
}

/**
 * Response from GET /history/.
 */
export interface HistoryResponse {
  trips: TripHistoryEntry[];
}
