// api/src/rank.ts
import { apiClient } from "./client";
import {
    GlobalRankResponse,
    RankUserRequest,
    RankUserResponse,
} from "./models/ranking.types";

/**
 * POST /rank/user
 * Retorna a posição global de um usuário no ranking.
 */
export async function getUserRank(
  payload: RankUserRequest
): Promise<RankUserResponse> {
  return apiClient.post<RankUserResponse>("/rank/user", payload);
}

/**
 * GET /rank/global
 * Retorna o ranking global de usuários.
 */
export async function getGlobalRank(): Promise<GlobalRankResponse> {
  return apiClient.get<GlobalRankResponse>("/rank/global");
}
