// api/src/rank.ts
import { apiClient } from "./client";
import {
  RouteShapeResponse
} from "./models/routes.types";

/**
 * POST /rank/user
 * Retorna a posição global de um usuário no ranking.
 */
export async function getRouteShape(
  route_id: string
): Promise<RouteShapeResponse> {
  return apiClient.get<RouteShapeResponse>(`/routes/shape/${route_id}`);
}
