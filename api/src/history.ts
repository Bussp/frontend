
import { apiClient } from "./client";
import { HistoryRequest, HistoryResponse } from "./models/history.types";

/**
 * POST /history/
 * Retorna o histórico de viagens do usuário (datas e scores).
 */
export async function getUserHistory(
  payload: HistoryRequest,
): Promise<HistoryResponse> {
  return apiClient.post<HistoryResponse>("/history/", payload);
}
