import { apiClient } from "../client";
import type { HistoryResponse } from "../models/history.types";

/**
 * GET /history/
 * Gets the current user's trip history.
 */
export async function getUserHistory(): Promise<HistoryResponse> {
  return apiClient.get<HistoryResponse>("/history/");
}
