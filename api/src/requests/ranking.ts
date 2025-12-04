import { apiClient } from "../client";
import type {
  GlobalRankingResponse,
  UserRankingResponse,
} from "../models/ranking.types";

/**
 * GET /rank/user
 * Gets the current user's ranking position.
 */
export async function getUserRanking(): Promise<UserRankingResponse> {
  return apiClient.get<UserRankingResponse>("/rank/user");
}

/**
 * GET /rank/global
 * Gets the global user ranking (leaderboard).
 */
export async function getGlobalRanking(): Promise<GlobalRankingResponse> {
  return apiClient.get<GlobalRankingResponse>("/rank/global");
}
