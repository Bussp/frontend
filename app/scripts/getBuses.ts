// scripts/getBuses.ts
import { Coord, Bus } from "./busDetection";
import { getRoutesPositions } from "../api/routes.ts";
import {
  RoutesPositionsRequest,
  RoutesPositionsResponse,
  RouteIdentifier,
  BusPosition,
} from "../api/models/routes.types";

export async function fetchBusPositions(routes: RouteIdentifier[]): Promise<Bus[]> {
  try {
    const payload: RoutesPositionsRequest = { routes };
    const response: RoutesPositionsResponse = await getRoutesPositions(payload);

    if (!response || !response.buses) return [];

    return response.buses.map((b: BusPosition) => ({
      id: `${b.route.bus_line}-${b.route.bus_direction}`,
      position: {
        latitude: b.position.latitude,
        longitude: b.position.longitude,
      },
    }));
  } catch (err) {
    console.error("Erro ao buscar posições dos ônibus:", err);
    return [];
  }
}
