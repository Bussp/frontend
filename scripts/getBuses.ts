// scripts/getBuses.ts
import {
  BusPosition,
  BusRouteResponse
} from "../api/src/models/routes.types";
import { getBusPositions, searchRoutes } from "../api/src/requests/routes";
import { Bus } from "../models/buses";

export async function fetchBusDetails(route: string, direction: number): Promise<BusRouteResponse | null> {
  try {
    const response = await searchRoutes(route);

    if (!response || !response.routes || response.routes.length === 0) return null;

    // Find the route with the matching direction
    const matchingRoute = response.routes.find(
      (r) => r.route.bus_direction === direction
    );

    return matchingRoute || response.routes[0];

  } catch (err) {
    console.error("Erro ao buscar detalhes da rota:", err);
    return null;
  }
}

export async function fetchBusPositions(routeDetails: BusRouteResponse): Promise<Bus[]> {
  try {
    const payload = { 
      routes: [{ route_id: routeDetails.route_id }] 
    };
    const response = await getBusPositions(payload);

    if (!response || !response.buses) return [];

    return response.buses.map((b: BusPosition, idx: number) => ({
      id: idx.toString(),
      type: routeDetails.route.bus_direction,
      position: {
        latitude: b.position.latitude,
        longitude: b.position.longitude,
      },
    }));
  } catch (err: any) {
    // Só loga o erro se não for timeout (para evitar spam no console)
    if (!err?.message?.includes('timeout')) {
      console.error("Erro ao buscar posições dos ônibus:", err);
    }
    return [];
  }
}
