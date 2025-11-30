// api/trips.ts
import { apiClient } from "./client"; // ou apiClient, igual você usou em users
import type {
    TripCreateRequest,
    TripCreateResponse,
} from "./models/trips.types";

/**
 * POST /trips/
 * Cria uma nova viagem e retorna o score calculado.
 * Requer JWT já configurado no client (login feito antes).
 */
export async function createTrip(
  data: TripCreateRequest
): Promise<TripCreateResponse> {

  return apiClient.post<TripCreateResponse, TripCreateRequest>("/trips/", data);
}
