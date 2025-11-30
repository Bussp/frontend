import { apiClient } from "./client";
import {
    RoutesPositionsRequest,
    RoutesPositionsResponse,
} from "./models/routes.types";

/**
 * POST /routes/positions
 * Retorna as posições atuais dos ônibus para as rotas informadas.
 */
export async function getRoutesPositions(
  payload: RoutesPositionsRequest,
): Promise<RoutesPositionsResponse> {
  return apiClient.post<RoutesPositionsResponse>("/routes/positions", payload);
}