// scripts/getBuses.ts
import {
  BusPosition,
  RouteIdentifier,
  RoutesDetailsRequest,
  RoutesDetailsResponse,
  RoutesPositionsRequest,
  RoutesPositionsResponse
} from "../../api/src/models/routes.types";
import { getRouteDetails, getRoutesPositions } from "../../api/src/routes";
import { Bus } from "../models/buses";

export async function fetchBusDetails(route: string, direction: number): Promise<RoutesDetailsResponse | null> {
  try {
    const routeIdentifier: RouteIdentifier = {
      bus_line: route,
      bus_direction: direction // po por enquanto ta 1 mas tem q ver como q manda a direcao pra ca
    }

    const payload: RoutesDetailsRequest = { routes: [routeIdentifier] };
    const response: RoutesDetailsResponse = await getRouteDetails(payload);

    if (!response || !response.routes) return null;
    return response;

  } catch (err) {
    console.error("Erro ao buscar posições dos ônibus:", err);
    return null;
  }
}

export async function fetchBusPositions(detailsResponse: RoutesDetailsResponse): Promise<Bus[]> {
  try {

    const payload: RoutesPositionsRequest = { routes: detailsResponse.routes };
    const response: RoutesPositionsResponse = await getRoutesPositions(payload);

    if (!response || !response.buses) return [];

    return response.buses.map((b: BusPosition, idx: number) => ({
      id: idx.toString(),
      type: b.route.bus_direction,
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
